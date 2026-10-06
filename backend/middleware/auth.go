package middleware

import (
	"backend/db"
	"backend/domain"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// CompareHashAndSecret verifies hashed password matches the database hash.
func CompareHashAndSecret(hash string, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

// Hashes password before registration to avoid plain passwords.
func HashPassword(w http.ResponseWriter, password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return "", err
	}

	return string(hashed), nil
}

// Hashes key before registration to avoid plain keys.
func HashKey(w http.ResponseWriter, key string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(key), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash key", http.StatusInternalServerError)
		return "", err
	}

	return string(hashed), nil
}

// RegisterUserIntoDB is used to registrate the provided, if valid, registration body of data.
func RegisterUserIntoDB(p *domain.RegisterRequest) error {
	_, err := db.Exec(db.InsertUser, p.Email, p.Password)
	return err
}
