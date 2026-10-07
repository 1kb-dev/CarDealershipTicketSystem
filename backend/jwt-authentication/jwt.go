package jwtauth

import (
	"backend/domain"
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const sessionDuration = 24 * time.Hour

// setupSecureCookies sets an HTTP-only cookie containing the JWT token for an authenticated session.
func setupSecureCookies(w http.ResponseWriter, ts string) {
	secure := os.Getenv("APP_ENV") == "production"
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    ts,
		Expires:  time.Now().Add(sessionDuration),
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
	})
}

// ClearJwtToken removes the authentication token by expiring the JWT cookie.
func ClearJwtToken(w http.ResponseWriter) {
	secure := os.Getenv("APP_ENV") == "production"
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
	})
}

// CreateJwtToken generates a signed JWT for a user and stores it in an HTTP-only cookie.
func CreateJwtToken(w http.ResponseWriter, p *domain.RegisterRequest) error {
	if p.Email == "" {
		return errors.New("missing email")
	}

	jwtKey := []byte(os.Getenv("JWT_KEY"))
	if len(jwtKey) == 0 {
		return errors.New("missing JWT_KEY")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": p.Email,
		"role":  p.Role,
		"exp":   time.Now().Add(sessionDuration).Unix(),
	})

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return err
	}

	setupSecureCookies(w, tokenString)

	return nil
}

// ProtectedAdminHandler wraps an HTTP handler and allows only authenticated users with the admin role to execute it.
func ProtectedAdminHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err := ValidateJWTFromRequest(r)
		role, err := GetRoleFromRequest(r)
		if err != nil || role != "admin" {
			log.Printf("Invalid or missing token: %v", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

// ProtectedClientHandler wraps an HTTP handler and allows authenticated workers, administrators, and guests to execute it.
func ProtectedClientHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err := ValidateJWTFromRequest(r)
		role, err := GetRoleFromRequest(r)
		if err != nil || (role != "admin" && role != "worker" && role != "guest") {
			log.Printf("DB error: ")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

// ValidateJWTFromRequest retrieves and validates the JWT token from the request cookie.
func ValidateJWTFromRequest(r *http.Request) (*jwt.Token, error) {
	cookie, err := r.Cookie("token")
	if err != nil {
		return nil, err
	}

	jwtKey := []byte(os.Getenv("JWT_KEY"))
	if len(jwtKey) == 0 {
		return nil, errors.New("missing JWT_KEY")
	}

	return jwt.Parse(cookie.Value, func(token *jwt.Token) (any, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method")
		}

		return jwtKey, nil
	})
}

// GetRoleFromRequest validates the request token and returns its role claim.
func GetRoleFromRequest(r *http.Request) (string, error) {
	token, err := ValidateJWTFromRequest(r)
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", errors.New("invalid token claims")
	}

	role, ok := claims["role"].(string)
	if !ok || role == "" {
		return "", errors.New("missing role claim")
	}

	return role, nil
}
