package db

import (
	"context"
	"database/sql"
	"log"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB

func ConnectDB() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://postgres:postgres@db:5432/noxer?sslmode=disable"
	}

	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		log.Fatalf("❌ Ошибка подключения к БД: %v", err)
	}

	db.SetConnMaxLifetime(time.Minute * 5)
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(10)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("❌ БД не отвечает: %v", err)
	}

	DB = db
	log.Println("✅ Подключение к БД успешно")
}

func Close() {
	if DB != nil {
		DB.Close()
		log.Println("🔌 Подключение к БД закрыто")
	}
}
