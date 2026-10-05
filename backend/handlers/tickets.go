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

	_ = db.QueryRow(db.InsertTicket, payload.Category, payload.Platform, payload.Subject, payload.Issue, payload.ClaimedByUserID)
	var ticket domain.TicketRequest
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "created",
		"ticket": ticket,
	})
}

type TicketRequest struct {
	TicketID			int16	    	`json:"ticket_id"`
	UserID				int16			`json:"user_id"`
	PriorityLevel  		int8           	`json:"priority_level"`
	Category       		string       	`json:"category"`
	Platform 			string 			`json:"platform"`
	Subject       		string       	`json:"subject"`
	Issue         		string       	`json:"issue"`
	ClaimedByUserID		int16       	`json:"claimed_by_user_id"`
}