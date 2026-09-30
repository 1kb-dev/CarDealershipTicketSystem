package handlers

import (
	"data-access/db"
	"data-access/domain"
	"data-access/middleware"
	"encoding/json"
	"net/http"
	"strings"
)

func StudentSuggestHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsGetMethod(w, r) {
		return
	}

	q := strings.TrimSpace(r.URL.Query().Get("q"))
	if len(q) < 2 {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]domain.Lend{})
		return
	}

	rows, err := db.Query(db.SuggestStudents, q+"%")
	if middleware.CheckInternalServerStatus(w, err) {
		return
	}
	defer rows.Close()

	results := []domain.Lend{}
	for rows.Next() {
		var s domain.Lend
		if err := rows.Scan(&s.StudentID, &s.FullName); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		results = append(results, s)
	}

	if middleware.VerifyRowsQueried(w, rows) {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func SerialSuggestHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsGetMethod(w, r) {
		return
	}

	q := strings.TrimSpace(r.URL.Query().Get("q"))
	if len(q) < 2 {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]domain.Lend{})
		return
	}

	rows, err := db.Query(db.SuggestSerials, q+"%", q+"%")
	if middleware.CheckInternalServerStatus(w, err) {
		return
	}
	defer rows.Close()

	results := []domain.Lend{}
	for rows.Next() {
		var s domain.Lend
		if err := rows.Scan(&s.Serial, &s.Computer); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		results = append(results, s)
	}

	if middleware.VerifyRowsQueried(w, rows) {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
