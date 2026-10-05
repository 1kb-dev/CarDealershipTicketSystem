package domain

// handlers.lends
// handlers.returns
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
