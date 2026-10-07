package domain

// handlers.CreateTicketHandler
type TicketRequest struct {
	TicketID        int32  `json:"ticket_id"`
	UserID          int16  `json:"user_id"`
	Email           string `json:"email"`
	PriorityLevel   int8   `json:"priority_level"`
	Category        string `json:"category"`
	Platform        string `json:"platform"`
	Subject         string `json:"subject"`
	Issue           string `json:"issue"`
	ClaimedByUserMail string `json:"claimed_by_user_mail"`
}

// handlers.ClaimTicketHandler
type ClaimTicketRequest struct {
	TicketID int32 `json:"ticket_id"`
	UserID   int16 `json:"user_id"`
}
