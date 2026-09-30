package handlers

import (
	"data-access/middleware"
	"net/http"
)

// AdminHandler verifies the processed request to the admin endpoint is of method POST.
func AdminHandler(w http.ResponseWriter, r *http.Request) {
	if middleware.DebugFetch(w, r) {
		return
	}

	if !middleware.VerifyIsPostMethod(w, r) {
		return
	}
}
