package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	db "noxer-db/db"
)

func waitDB(dsn string, timeout time.Duration) error {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	for {
		pool, err := pgxpool.New(ctx, dsn)
		if err == nil {
			if err := pool.Ping(ctx); err == nil {
				pool.Close()
				return nil
			}
			pool.Close()
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
			log.Println("Ожидаем Postgres...")
			time.Sleep(1 * time.Second)
		}
	}
}

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://postgres:postgres@db:5432/noxer?sslmode=disable"
	}

	// Ждём базу
	if err := waitDB(dsn, 30*time.Second); err != nil {
		log.Fatal("DB не доступна:", err)
	}

	if err := db.Init(dsn); err != nil {
		log.Fatal("Ошибка подключения:", err)
	}
	defer db.Close()

	if err := db.ApplyMigrations("./migrations"); err != nil {
		log.Fatal("Ошибка миграции:", err)
	}

	if os.Getenv("SEED") == "1" {
		if err := db.Seed(); err != nil {
			log.Fatal("Ошибка seed:", err)
		}
	}

	log.Println("✅ noxer-db: миграции применены")
}
