package handlers

import (
	"backend/db"
	"backend/domain"
	jwtauth "backend/jwt-authentication"
	"backend/middleware"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// EmailHandler is a helper to the RegisterHandler function, providing checks for emails.
func EmailHandler(w http.ResponseWriter, p *domain.RegisterRequest) bool {
	email := strings.TrimSpace(p.Email)
	if !strings.Contains(email, "@") {
		http.Error(w, "Invalid email", http.StatusUnprocessableEntity)
		return true
	}

	p.Email = email
	emailRow := db.QueryRow(db.CheckIfEmailAlreadyRegistered, p.Email)
	if middleware.ValidateEmailAvailability(w, emailRow, p) {
		return true
	}

	return false
}

// NormalizeEmail trims and validates an email address for authentication requests.
func NormalizeEmail(w http.ResponseWriter, email string) (string, bool) {
	email = strings.TrimSpace(email)
	if !strings.Contains(email, "@") {
		http.Error(w, "Invalid email", http.StatusUnprocessableEntity)
		return "", true
	}

	return email, false
}

// LoginHandler handles all logons from the '/api/login' API.
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsPostMethod(w, r) {
		return
	}

	var payload domain.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		log.Printf("Login JSON decode error: %v", err)
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	normalEmail, invalidEmail := NormalizeEmail(w, payload.Email)
	if invalidEmail {
		return
	}
	payload.Email = normalEmail

	emailRow := db.QueryRow(db.FindUserByEmail, payload.Email)

	var u domain.UserAuth
	if middleware.ValidateUserQueryScan(w, emailRow, &u) {
		return
	}

	if err := middleware.CompareHashAndSecret(u.PasswordHash, payload.Password); err != nil {
		log.Printf("Secret comparison error: %v", err)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := jwtauth.CreateJwtToken(w, &domain.RegisterRequest{Email: u.Email, Role: u.Role}); err != nil {
		log.Printf("CreateJwtToken error: %v", err)
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{
		"status": "authenticated",
		"userId": u.UserID,
		"email":  u.Email,
	})
}

// LogoutHandler terminates the user's current session by clearing their authentication token.
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsPostMethod(w, r) {
		return
	}

	jwtauth.ClearJwtToken(w)
	w.WriteHeader(http.StatusOK)
}

// RegisterHandler handles all registrations from the '/api/register' API.
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsPostMethod(w, r) {
		return
	}
	
	var payload domain.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var roleAuth domain.UserAuth
	roleRow := db.QueryRow(db.FindUserRoleByEmail, payload.Email)
	if middleware.VerifyHasAdminRole(w, roleRow, &roleAuth) {
		return
	}

	if EmailHandler(w, &payload) {
		return
	}

	emailRow := db.QueryRow(db.CheckIfEmailAlreadyRegistered, payload.Email)
	if middleware.ValidateEmailAvailability(w, emailRow, &payload) {
		return
	}

	passwdHash, err := middleware.HashPassword(w, payload.Password)
	if err != nil {
		return
	}
	payload.Password = passwdHash

	if err := middleware.RegisterUserIntoDB(&payload); err != nil {
		log.Printf("RegisterUserIntoDB error: %v", err)
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "registered", "message": "User registered successfully"})
}

// SessionHandler checks if the current user has a valid session by verifying their JWT token.
func SessionHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsGetMethod(w, r) {
		return
	}

	token, err := jwtauth.ValidateJWTFromRequest(r)
	if err != nil {
		jwtauth.ClearJwtToken(w)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]bool{"authenticated": false})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	email, emailOK := claims["email"].(string)
	if !ok || !emailOK || email == "" {
		http.Error(w, "Invalid session claims", http.StatusUnauthorized)
		return
	}

	var userID int32
	var role string
	if err := db.QueryRow(db.FindUserIdentityByEmail, email).Scan(&userID, &role); err != nil {
		log.Default().Printf("Error retrieving user ID for email %s: %v", email, err)
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{
		"authenticated": true,
		"userId":        userID,
		"email":         email,
		"role": 		 role,
	})
}
