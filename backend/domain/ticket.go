package domain

import (
	"database/sql"
	"time"
)

// handlers.lends
// handlers.returns
type Ticket struct {
	TicketID			int				`json:"ticket_id"`
	UserID				int				`json:"user_id"`
	PriorityLevel  		int          	`json:"priority_level"`
	Category       		string       	`json:"category"`
	Platform 			string 			`json:"platform"`
	Subject       		string       	`json:"subject"`
	Issue         		string       	`json:"issue"`
	ClaimedByUserID		string       	`json:"claimed_by_user_id"`
	ExpireDate     		time.Time    	`json:"due_date"`
	ReturnDate     		*time.Time   	`json:"return_date,omitempty"`
	ReturnDateScan 		sql.NullTime	`json:"-"`
}
