package db

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"
	"time"

	_ "github.com/godror/godror"
	"github.com/joho/godotenv"
)

var db *sql.DB

// Application connection to database
func Connect() {
	envPath := filepath.Join("..", ".env")
	if err := godotenv.Load(envPath); err != nil {
		log.Printf("Warning: could not load .env file from %s: %v", envPath, err)
	}

	user := os.Getenv("DBUSER")
	passwd := os.Getenv("DBPASS")
	service := "XE"
	host := "127.0.0.1"
	port := "1521"

	var err error
	dsn := "oracle://" + user + ":" + passwd + "@" + host + ":" + port + "/" + service
	db, err = sql.Open("godror", dsn)
	if err != nil {
		log.Fatalf("unable to open DB: %v", err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatalf("unable to ping DB: %v", pingErr)
	}

	log.Println("Connected! >>> [" + service + "]")

	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	db.SetConnMaxIdleTime(1 * time.Minute)
}
