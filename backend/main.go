package main

import (
	"fmt"
	"log"
	"os"

	"noxer-backend/internal/config"
	"noxer-backend/internal/db"
	"noxer-backend/internal/handler"
	"noxer-backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config.LoadEnv()

	db.ConnectDB()

	app := fiber.New()

	app.Use(func(c *fiber.Ctx) error {
		origin := c.Get("Origin")
		fmt.Println("🌐 Incoming Origin:", origin)
		return c.Next()
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("🚀 Noxer API работает!")
	})

	// Auth routes (public)
	auth := app.Group("/api/auth")
	auth.Post("/register", handler.RegisterUser)
	auth.Post("/login", handler.LoginUser)
	auth.Post("/2fa/verify", handler.Verify2FA)
	auth.Post("/refresh", handler.RefreshToken)
	auth.Post("/logout", handler.LogoutUser)

	// Products routes (protected)
	products := app.Group("/api/products", middleware.RequireAuth)
	products.Get("/", handler.ListProducts)
	products.Get("/search", handler.SearchProducts)

	// Categories routes (protected)
	categories := app.Group("/api/categories", middleware.RequireAuth)
	categories.Get("/", handler.ListCategories)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("📡 Сервер запущен на http://localhost:" + port)
	log.Fatal(app.Listen(":" + port))
}
