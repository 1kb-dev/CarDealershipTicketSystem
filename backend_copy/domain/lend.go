package domain

import (
	"database/sql"
	"time"
)

// handlers.lends
// handlers.returns
type Lend struct {
	StudentID      int          `json:"student_id"`
	SelectionID    int          `json:"selection_id"`
	FullName       string       `json:"student_name"`
	Computer       string       `json:"computer"`
	Serial         string       `json:"computer_serial"`
	MouseSerial    string       `json:"mouse_serial"`
	ExpireDate     time.Time    `json:"due_date"`
	ReturnDate     *time.Time   `json:"return_date,omitempty"`
	ReturnDateScan sql.NullTime `json:"-"`
}
