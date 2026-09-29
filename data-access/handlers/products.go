package handlers

import (
	"data-access/db"
	"data-access/domain"
	"data-access/middleware"
	"encoding/json"
	"net/http"
)

// Get all products from vProducts (JSON)
func GetProducts(w http.ResponseWriter, r *http.Request) {
	// Query rows to select all products
	rows, err := db.Query("SELECT product_id, product_name, product_price FROM vProducts;")
	if middleware.CheckInternalServerStatus(w, err) {
		return
	}

	defer rows.Close() // Close rows after querying

	// Assign products into rows after query scan
	products := []domain.Product{}
	for rows.Next() {
		var p domain.Product
		if middleware.ValidateQueryScan(w, rows, &p) {
			return
		}
		products = append(products, p)
	}

	// Check server status before sending data
	if middleware.VerifyRowsQueried(w, rows) {
		return
	}

	// Send data as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}
