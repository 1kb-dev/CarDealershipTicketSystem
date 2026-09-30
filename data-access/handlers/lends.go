package handlers

import (
	"data-access/db"
	"data-access/domain"
	"data-access/middleware"
	"database/sql"
	"encoding/json"
	"net/http"
)

// GetLendsRequestHandler provides data of lends from the database in JSON format.
func GetLendsRequestHandler(w http.ResponseWriter, r *http.Request) {
	middleware.ServeUniversalLendsQuery(
		w,
		r,
		db.ViewLends,
		func(p *domain.Lend) []interface{} { return middleware.BuildLendScanArgs(p, false) },
		false,
	)
}

// SendLendRequestHandler creates a new lend record for a student borrowing a peripheral device.
func SendLendRequestHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsPostMethod(w, r) {
		return
	}

	var payload domain.Lend
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var studentId int
	row := db.QueryRow(db.StudentIdFromName, payload.FullName)
	if err := row.Scan(&studentId); err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Student ID with full given name does not exist", http.StatusNotFound)
			return
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var selectionId int
	row = db.QueryRow(db.SelectionIdFromSerial, payload.Serial)
	if err := row.Scan(&selectionId); err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Peripheral with given serial does not exist", http.StatusNotFound)
			return
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	row = db.QueryRow(db.CheckExistingLend, studentId, selectionId)
	exists, hadError := middleware.ScanExistence(w, row)
	if hadError {
		return
	}
	if exists {
		http.Error(w, "Peripheral already lent out", http.StatusConflict)
		return
	}

	oracleDate := payload.ExpireDate.Format("2006-01-02 15:04:05.000")

	_, err := db.Exec(db.InsertLend, studentId, selectionId, oracleDate)
	if middleware.CheckInternalServerStatus(w, err) {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "lend created"})

	BroadcastSSE("lend-created")
}
