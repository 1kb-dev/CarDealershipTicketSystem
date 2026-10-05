package jwtauth

import (
	"backend/domain"
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Sets a secure HTTP cookie containing the JWT token for authenticated sessions.
func setupSecureCookies(w http.ResponseWriter, ts string) {
	secure := os.Getenv("APP_ENV") == "production"
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    ts,
		Expires:  time.Now().Add(time.Hour * 24),
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
	})
}

// Removes the authentication token by clearing the JWT cookie.
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

// Generates a JWT token for a user and stores it in a secure cookie.
func CreateJwtToken(w http.ResponseWriter, p *domain.RegisterRequest) error {
	if p.Email == "" {
		return errors.New("missing email")
	}

	jwtKey := []byte(os.Getenv("JWT_KEY"))
	if len(jwtKey) == 0 {
		return errors.New("missing JWT_KEY")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": 	p.Email,
		"role": 	p.Role,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return err
	}

	setupSecureCookies(w, tokenString)

	return nil
}

// Wraps an HTTP handler to require valid JWT authentication before execution.
func ProtectedHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err := ValidateJWTFromRequest(r)

		if err != nil {
			http.Error(w, "Invalid or missing token", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

// Retrieves and validates the JWT token from the request cookie.
func ValidateJWTFromRequest(r *http.Request) (*jwt.Token, error) {
	cookie, err := r.Cookie("token")
	if err != nil {
		return nil, err
	}

	jwtKey := []byte(os.Getenv("JWT_KEY"))
	if len(jwtKey) == 0 {
		return nil, errors.New("missing JWT_KEY")
	}

	return jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method")
		}

		return jwtKey, nil
	})
}

// GetRoleFromRequest returns the role stored in the authenticated JWT cookie.
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
