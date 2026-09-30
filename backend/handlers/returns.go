// GO THROUG THE LOGIC; I SMELL HIDDEN ERRORS

package handlers

import (
	"data-access/db"
	"data-access/domain"
	"data-access/middleware"
	"encoding/json"
	"log"
	"net/http"
)

// GetLendsRequestHandler provides data of lends with return date from the database in JSON format.
func GetReturnsRequestHandler(w http.ResponseWriter, r *http.Request) {
	middleware.ServeUniversalLendsQuery(
		w,
		r,
		db.ViewReturns,
		func(p *domain.Lend) []interface{} { return middleware.BuildLendScanArgs(p, true) },
		true,
	)
}

func SendReturnHandler(w http.ResponseWriter, r *http.Request) {
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

	oracleExpireDate := payload.ExpireDate.Format("2006-01-02 15:04:05.000")
	log.Printf("Expiration: %v = %v\n", payload.ExpireDate, oracleExpireDate)

	row := db.QueryRow(db.CheckIsReturned, payload.StudentID, payload.SelectionID, oracleExpireDate)
	returned, hadError := middleware.ScanExistence(w, row)
	if hadError {
		return
	}
	if returned {
		http.Error(w, "Lend already returned", http.StatusConflict)
		return
	}

	_, err := db.Exec(db.AddReturnDate, payload.StudentID, payload.SelectionID, oracleExpireDate)
	if middleware.CheckInternalServerStatus(w, err) {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "lend returned"})

	BroadcastSSE("lend-returned")
}

func RevertReturnHandler(w http.ResponseWriter, r *http.Request) {
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

	oracleExpireDate := payload.ExpireDate.Format("2006-01-02 15:04:05.000")
	oracleReturnDate := payload.ReturnDate.Format("2006-01-02 15:04:05.000")

	row := db.QueryRow(db.CheckIsReturned, payload.StudentID, payload.SelectionID, oracleExpireDate)
	exists, hadError := middleware.ScanExistence(w, row)
	if hadError {
		return
	}
	if !exists {
		http.Error(w, "Lend is missing a return date", http.StatusConflict)
		return
	}

	_, err := db.Exec(db.RemoveReturnDate, payload.StudentID, payload.SelectionID, oracleExpireDate, oracleReturnDate)
	if middleware.CheckInternalServerStatus(w, err) {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "return reverted"})

	BroadcastSSE("return-reverted")
}

func DeleteReturnHandler(w http.ResponseWriter, r *http.Request) {
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

	oracleExpireDate := payload.ExpireDate.Format("2006-01-02 15:04:05.000")
	oracleReturnDate := payload.ReturnDate.Format("2006-01-02 15:04:05.000")

	row := db.QueryRow(db.CheckIsReturned, payload.StudentID, payload.SelectionID, oracleExpireDate)
	exists, hadError := middleware.ScanExistence(w, row)
	if hadError {
		return
	}
	if !exists {
		http.Error(w, "Return is non-existent", http.StatusConflict)
		return
	}

	_, err := db.Exec(db.DeleteReturnedLendRecord, payload.StudentID, payload.SelectionID, oracleExpireDate, oracleReturnDate)
	if middleware.CheckInternalServerStatus(w, err) {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "return deleted"})

	BroadcastSSE("return-deleted")
}
