package handlers

import (
	"backend/db"
	"backend/domain"
	"backend/middleware"
	"encoding/json"
	"net/http"
)

func CreateTicketHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsPostMethod(w, r) {
		return
	}

	var payload domain.TicketRequest
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if payload.PriorityLevel == 0 {
		payload.PriorityLevel = 5
	}

	row := db.QueryRow(db.InsertTicket, payload.UserID, payload.PriorityLevel,
		payload.Category, payload.Platform, payload.Subject, payload.Issue)
	if err := row.Scan(&payload.TicketID); err != nil {
		http.Error(w, "Failed to create ticket", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"status":             "created",
		"ticket_id":          payload.TicketID,
		"user_id":            payload.UserID,
		"priority_level":     payload.PriorityLevel,
		"category":           payload.Category,
		"platform":           payload.Platform,
		"subject":            payload.Subject,
		"issue":              payload.Issue,
		"claimed_by_user_id": payload.ClaimedByUserID,
	})
}
