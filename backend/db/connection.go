package db

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

var db *sql.DB

func Connect() {
	envPath := filepath.Join(".", ".env")
	if err := godotenv.Load(envPath); err != nil {
		log.Printf("Warning: could not load .env file from %s: %v", envPath, err)
	}

	user := os.Getenv("DBUSER")
	passwd := os.Getenv("DBPASS")
	service := os.Getenv("DB")
	host := os.Getenv("DBHOST")
	port := os.Getenv("DBPORT")

	var err error
	dsn := "postgresql://" + user + ":" + passwd + "@" + host + ":" + port + "/" + service
	db, err = sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("unable to open DB: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("unable to ping DB: %v", err)
	}

	log.Println("Connected! >>> [" + service + "]")

	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	db.SetConnMaxIdleTime(1 * time.Minute)
}
