package handlers

import (
	"data-access/db"
	"data-access/domain"
	"data-access/middleware"
	"net/http"
)

// GetBlacklistsRequestHandler provides data of blacklisted students from being lent in JSON format.
func GetBlacklistsRequestHandler(w http.ResponseWriter, r *http.Request) {
	middleware.ServeUniversalLendsQuery(
		w,
		r,
		db.ViewBlacklists,
		func(p *domain.Lend) []interface{} { return middleware.BuildLendScanArgs(p, true) },
		false,
	)
}
