package main

import (
	"backend/db"
	"backend/handlers"
	jwtauth "backend/jwt-authentication"
	"backend/middleware"
	"log"
	"net/http"
)

func logRequest(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next(w, r)
	}
}

func main() {
	db.Connect()

	// Auth
	http.HandleFunc("/api/login", logRequest(middleware.CORS(handlers.LoginHandler)))
	http.HandleFunc("/api/logout", logRequest(middleware.CORS(handlers.LogoutHandler)))
	http.HandleFunc("/api/register", logRequest(middleware.CORS(handlers.RegisterHandler)))
	http.HandleFunc("/api/session", logRequest(middleware.CORS(handlers.SessionHandler))) // JWT

	// Security
	http.HandleFunc("/api/admin", logRequest(middleware.CORS(jwtauth.ProtectedHandler(handlers.AdminHandler))))

	// --------

	log.Fatal(http.ListenAndServe(":8080", nil))
}
