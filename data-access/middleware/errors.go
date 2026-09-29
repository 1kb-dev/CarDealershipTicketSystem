package middleware

import (
	models "data-access/domain"
	"database/sql"
	"net/http"
)

func CheckInternalServerStatus(w http.ResponseWriter, err error) bool {
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return true
	}
	return false
}

func ValidateQueryScan(w http.ResponseWriter, rows *sql.Rows, p *models.Product) bool {
	if scanErr := rows.Scan(&p.ID, &p.Name, &p.Price); scanErr != nil {
		http.Error(w, scanErr.Error(), http.StatusInternalServerError)
		return true
	}
	return false
}

func VerifyRowsQueried(w http.ResponseWriter, rows *sql.Rows) bool {
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return true
	}
	return false
}
