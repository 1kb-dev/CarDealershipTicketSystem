// GO THROUG THE LOGIC; I SMELL HIDDEN ERRORS

package handlers

import (
	"data-access/db"
	"data-access/domain"
	"data-access/middleware"
	"net/http"
)

// GetOverdueRequestHandler provides data of lends with a late return date from the database in JSON format.
func GetOverdueRequestHandler(w http.ResponseWriter, r *http.Request) {
	middleware.ServeUniversalLendsQuery(
		w,
		r,
		db.ViewOverdue,
		func(p *domain.Lend) []interface{} { return middleware.BuildLendScanArgs(p, true) },
		false,
	)
}
