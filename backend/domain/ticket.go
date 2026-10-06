package domain

// handlers.CreateTicketHandler
type TicketRequest struct {
	TicketID        int32  `json:"ticket_id"`
	UserID          int32  `json:"user_id"`
	PriorityLevel   int16  `json:"priority_level"`
	Category        string `json:"category"`
	Platform        string `json:"platform"`
	Subject         string `json:"subject"`
	Issue           string `json:"issue"`
	ClaimedByUserID int32  `json:"claimed_by_user_id"`
}
