package handlers

import (
	"data-access/db"
	"data-access/domain"
	jwtauth "data-access/jwt-authentication"
	"data-access/middleware"
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

// EmailHandler is a helper to the RegisterHandler function, providing checks for emails.
// It's exclusive, save for the username checks, for there are two.
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
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	row := db.QueryRow(db.FindUserByUsernameOrEmail, payload.UsernameOrEmail, payload.UsernameOrEmail)

	var u domain.UserAuth
	if middleware.ValidateUserQueryScan(w, row, &u) {
		return
	}

	if err := middleware.CompareHashAndSecret(u.PasswordHash, payload.Password); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := middleware.CompareHashAndSecret(u.Key, payload.Key); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := jwtauth.CreateJwtToken(w, &domain.RegisterRequest{Username: u.Username}); err != nil {
		log.Printf("CreateJwtToken error: %v", err)
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "authenticated"})
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

	if EmailHandler(w, &payload) {
		return
	}

	usernameRow := db.QueryRow(db.CheckUsernameAvailability, payload.Username)
	if middleware.ValidateUserAvailability(w, usernameRow, &payload) {
		return
	}

	passwdHash, err := middleware.HashPassword(w, payload.Password)
	if err != nil {
		return
	}
	payload.Password = passwdHash

	keyHash, err := middleware.HashKey(w, payload.Key)
	if err != nil {
		return
	}
	payload.Key = keyHash

	if err := middleware.RegisterUserIntoDB(&payload); err != nil {
		log.Printf("RegisterUserIntoDB error: %v", err)
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	if err := jwtauth.CreateJwtToken(w, &domain.RegisterRequest{Username: payload.Username}); err != nil {
		log.Printf("CreateJwtToken error: %v", err)
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "registered"})
}

// SessionHandler checks if the current user has a valid session by verifying their JWT token.
func SessionHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsGetMethod(w, r) {
		return
	}

	_, err := jwtauth.ValidateJWTFromRequest(r)
	authenticated := err == nil

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"authenticated": authenticated})
}
