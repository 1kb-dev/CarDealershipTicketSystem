package db

import (
	"database/sql"
	"log"
	"net/url"
	"os"
	"path/filepath"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib" // replaces godror
	"github.com/joho/godotenv"
)

var db *sql.DB

func Connect() {
	envPath := filepath.Join("..", ".env")
	if err := godotenv.Load(envPath); err != nil {
		log.Printf("Warning: could not load .env file from %s: %v", envPath, err)
	}

	user := os.Getenv("DBUSER")
	passwd := os.Getenv("DBPASS")
	dbname := os.Getenv("DB")
	host := os.Getenv("HOST")
	port := os.Getenv("PORT")

	u := url.URL{
		Scheme:   "postgres",
		User:     url.UserPassword(user, passwd),
		Host:     host + ":" + port,
		Path:     dbname,
		RawQuery: "sslmode=disable",
	}

	var err error
	db, err = sql.Open("pgx", u.String())
	if err != nil {
		log.Fatalf("unable to open DB: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("unable to ping DB: %v", err)
	}

	log.Println("Connected! >>> [" + dbname + "]")

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxIdleTime(1 * time.Minute)
}
