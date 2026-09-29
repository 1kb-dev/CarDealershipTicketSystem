package main

import (
	"data-access/db"
	"data-access/handlers"
	"data-access/middleware"
	"log"
	"net/http"
)

// Establish db connection, define HTTP route, start server on port :8080
func main() {
	db.Connect()
	http.HandleFunc("/products", middleware.CORS(handlers.GetProducts))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
