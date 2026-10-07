package handlers

import (
	"backend/db"
	"backend/domain"
	"backend/middleware"
	"database/sql"
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
		"status":               "created",
		"ticket_id":            payload.TicketID,
		"user_id":              payload.UserID,
		"priority_level":       payload.PriorityLevel,
		"category":             payload.Category,
		"platform":             payload.Platform,
		"subject":              payload.Subject,
		"issue":                payload.Issue,
		"claimed_by_user_mail": payload.ClaimedByUserMail,
	})
}

func GetTicketsHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsGetMethod(w, r) {
		return
	}

	rows, err := db.Query(db.GetTickets)
	if err != nil {
		http.Error(w, "Failed to fetch tickets", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tickets []domain.TicketRequest
	for rows.Next() {
		var ticket domain.TicketRequest
		var claimedByUserID int16
		var claimedByUserMail sql.NullString

		err := rows.Scan(
			&ticket.TicketID,
			&ticket.UserID,
			&ticket.Email,
			&ticket.PriorityLevel,
			&ticket.Category,
			&ticket.Platform,
			&ticket.Subject,
			&ticket.Issue,
			&claimedByUserID,
			&claimedByUserMail,
		)
		if err != nil {
			http.Error(w, "Failed to scan ticket", http.StatusInternalServerError)
			return
		}

		if claimedByUserMail.Valid {
			ticket.ClaimedByUserMail = claimedByUserMail.String
		}
		tickets = append(tickets, ticket)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, "Failed to read tickets", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tickets)

}

func ClaimTicketHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsPostMethod(w, r) {
		return
	}

	var payload domain.ClaimTicketRequest
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	result, err := db.Exec(db.ClaimTicket, payload.TicketID, payload.UserID)
	if err != nil {
		http.Error(w, "Failed to claim ticket", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "Failed to retrieve rows affected", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "No ticket found with the given ID", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{
		"status":    "claimed",
		"ticket_id": payload.TicketID,
	})
}
