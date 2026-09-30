package main

import (
	"data-access/db"
	"data-access/handlers"
	jwtauth "data-access/jwt-authentication"
	"data-access/middleware"
	"log"
	"net/http"
)

// logRequest records incoming API requests by method and path.
func logRequest(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next(w, r)
	}
}

// Establish db connection, define HTTP routes, starts server on port :8080
func main() {
	db.Connect()

	// --------

	// Lends
	http.HandleFunc("/api/lends", logRequest(middleware.CORS(handlers.GetLendsRequestHandler)))
	http.HandleFunc("/api/lend", logRequest(middleware.CORS(jwtauth.ProtectedHandler(handlers.SendLendRequestHandler))))

	// Returns
	http.HandleFunc("/api/returns", logRequest(middleware.CORS(handlers.GetReturnsRequestHandler)))
	http.HandleFunc("/api/return", logRequest(middleware.CORS(jwtauth.ProtectedHandler(handlers.SendReturnHandler))))
	http.HandleFunc("/api/revert", logRequest(middleware.CORS(jwtauth.ProtectedHandler(handlers.RevertReturnHandler))))
	http.HandleFunc("/api/delete", logRequest(middleware.CORS(jwtauth.ProtectedHandler(handlers.DeleteReturnHandler))))

	// Overdue
	http.HandleFunc("/api/overdue", logRequest(middleware.CORS(handlers.GetOverdueRequestHandler)))

	// Blacklists
	http.HandleFunc("/api/blacklists", logRequest(middleware.CORS(handlers.GetBlacklistsRequestHandler)))

	// Auth
	http.HandleFunc("/api/login", logRequest(middleware.CORS(handlers.LoginHandler)))
	http.HandleFunc("/api/logout", logRequest(middleware.CORS(handlers.LogoutHandler)))
	http.HandleFunc("/api/register", logRequest(middleware.CORS(handlers.RegisterHandler)))
	http.HandleFunc("/api/session", logRequest(middleware.CORS(handlers.SessionHandler))) // JWT

	// Suggestions
	http.HandleFunc("/api/suggest/students", logRequest(middleware.CORS(jwtauth.ProtectedHandler(handlers.StudentSuggestHandler))))
	http.HandleFunc("/api/suggest/serials", logRequest(middleware.CORS(jwtauth.ProtectedHandler(handlers.SerialSuggestHandler))))
	// Security
	http.HandleFunc("/api/admin", logRequest(middleware.CORS(jwtauth.ProtectedHandler(handlers.AdminHandler))))

	// Server-to-Client Communication
	http.HandleFunc("/sse", logRequest(middleware.CORS(handlers.SSEHandler)))

	// --------

	log.Fatal(http.ListenAndServe(":8080", nil))
}
