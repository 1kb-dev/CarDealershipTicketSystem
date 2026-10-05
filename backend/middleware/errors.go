package middleware

import (
	models "backend/domain"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"
)

// Helper to DebugFetch() to retrieve API failure as data
func GetFetchStatusAndResponse(r *http.Request) (int, map[string]interface{}) {
	reason := r.URL.Query().Get("reason")
	if reason == "" {
		reason = "Unknown error"
	}

	status := http.StatusInternalServerError
	if code := r.URL.Query().Get("status"); code != "" {
		if parsed, err := strconv.Atoi(code); err == nil && parsed >= 400 && parsed < 600 {
			status = parsed
		}
	}

	resp := map[string]interface{}{
		"error":     "Fetch failed",
		"reason":    reason,
		"path":      r.URL.Path,
		"method":    r.Method,
		"timestamp": time.Now().Format(time.RFC3339),
	}

	return status, resp
}

// Checks if a handler has failed upon fetch with stated reason and returns for reusability
func DebugFetch(w http.ResponseWriter, r *http.Request) bool {
	if r.URL.Query().Get("debug") == "1" {
		status, resp := GetFetchStatusAndResponse(r)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		_ = json.NewEncoder(w).Encode(resp)

		return true
	}

	return false
}

func ValidateUserQueryScan(w http.ResponseWriter, row *sql.Row, u *models.UserAuth) bool {
	if err := row.Scan(&u.ID, &u.Email, &u.Password, &u.Role); err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return true
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return true
	}

	return false
}

// Ensures the request is a GET.
func VerifyIsGetMethod(w http.ResponseWriter, r *http.Request) bool {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return false
	}

	return true
}

// Ensures the request is a POST.
func VerifyIsPostMethod(w http.ResponseWriter, r *http.Request) bool {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return false
	}

	return true
}

// CheckInternalServerStatus returns true and writes a 500 response when a database operation fails unexpectedly.
func CheckInternalServerStatus(w http.ResponseWriter, err error) bool {
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return true
	}

	return false
}

// ValidateLendQueryScan ensures lend query results are usable and reports a server error if they're not.
func ValidateLendQueryScan(w http.ResponseWriter, rows *sql.Rows, dest ...interface{}) bool {
	if scanErr := rows.Scan(dest...); scanErr != nil {
		http.Error(w, scanErr.Error(), http.StatusInternalServerError)
		return true
	}

	return false
}


// VerifyRowsQueried checks the iterator for query errors after reading rows.
func VerifyRowsQueried(w http.ResponseWriter, rows *sql.Rows) bool {
	if err := rows.Err(); err != nil {
		log.Printf("RowsQueried")
		http.Error(w, "DB error", http.StatusInternalServerError)
		return true
	}

	return false
}

// ScanExistingUsername retrieves an existing username to support "already taken" validation.
func ScanExistingUsername(w http.ResponseWriter, row *sql.Row) (string, bool) {
	var existingUsername string
	if err := row.Scan(&existingUsername); err != nil {
		if err == sql.ErrNoRows {
			return "", false
		}

		log.Printf("ScanExistingUsername DB error: %v", err)
		http.Error(w, "DB error", http.StatusInternalServerError)
		return "", true
	}

	return existingUsername, false
}

// ScanExistingEmail retrieves an existing email to support "already registered" validation.
func ScanExistingEmail(w http.ResponseWriter, row *sql.Row) (string, bool) {
	var existingEmail string
	if err := row.Scan(&existingEmail); err != nil {
		if err == sql.ErrNoRows {
			return "", false
		}

		log.Printf("ScanExistingEmail DB error: %v", err)
		http.Error(w, "DB error", http.StatusInternalServerError)
		return "", true
	}

	return existingEmail, false
}

// ValidateUserAvailability checks if a username is already in use and returns an appropriate client error.
func ValidateUserAvailability(w http.ResponseWriter, row *sql.Row, u *models.RegisterRequest) bool {
	existingUsername, scanErr := ScanExistingUsername(w, row)
	if scanErr {
		return true
	}

	if existingUsername == u.Username {
		http.Error(w, "Username already exists", http.StatusNotAcceptable)
		return true
	}

	return false
}

// ValidateEmailAvailability checks if an email is already in use and returns an appropriate client error.
func ValidateEmailAvailability(w http.ResponseWriter, row *sql.Row, e *models.RegisterRequest) bool {
	existingEmail, scanErr := ScanExistingEmail(w, row)
	if scanErr {
		return true
	}

	if existingEmail == e.Email {
		http.Error(w, "Email already registered", http.StatusNotAcceptable)
		return true
	}

	return false
}

// ScanExistence checks if a row exists.
func ScanExistence(w http.ResponseWriter, row *sql.Row) (bool, bool) {
	var count int
	if err := row.Scan(&count); err != nil {
		if err == sql.ErrNoRows {
			return false, false // No row means not found, no error
		}

		log.Printf("ScanIntExistence DB error: %v", err)
		http.Error(w, "DB error", http.StatusInternalServerError)
		return false, true // Not found, had error
	}

	return count > 0, false // Found, no error
}
