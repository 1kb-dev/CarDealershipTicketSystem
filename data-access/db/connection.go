package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

// Application connection to database
func Connect() {
	// Load environment variables from .env file
	envPath := filepath.Join("..", ".env")
	if err := godotenv.Load(envPath); err != nil {
		log.Printf("Warning: could not load .env file from %s: %v", envPath, err)
	}

	// Capture connection properties
	cfg := mysql.NewConfig()
	cfg.User = os.Getenv("DBUSER")
	cfg.Passwd = os.Getenv("DBPASS")
	cfg.Net = "tcp"
	cfg.Addr = "127.0.0.1:3306"
	cfg.DBName = "kaostekdb"

	// Get a database handle (open connection)
	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatalf("unable to open DB: %v", err)
	}

	// Test connection
	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatalf("unable to ping DB: %v", pingErr)
	}

	fmt.Println("Connected! >>> [" + cfg.DBName + "]")

	// Connection safety measures
	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	db.SetConnMaxIdleTime(1 * time.Minute)
}

// Allow query calls from handlers
func Query(query string, args ...interface{}) (*sql.Rows, error) {
	return db.Query(query, args...)
}
