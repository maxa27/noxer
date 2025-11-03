package handler

import (
	"noxer-backend/internal/dto"
	"noxer-backend/internal/usecase"

	"github.com/gofiber/fiber/v2"
)

func ListProducts(c *fiber.Ctx) error {
	products, err := usecase.GetAllProducts()
	if err != nil {
		return c.Status(500).JSON(dto.ErrorResponse{
			Code:        500,
			Title:       "Internal Server Error",
			Description: err.Error(),
		})
	}

	return c.JSON(products)
}

func SearchProducts(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return c.Status(400).JSON(dto.ErrorResponse{
			Code:        400,
			Title:       "Bad Request",
			Description: "Параметр поиска 'q' обязателен",
		})
	}

	products, err := usecase.SearchProducts(query)
	if err != nil {
		return c.Status(500).JSON(dto.ErrorResponse{
			Code:        500,
			Title:       "Internal Server Error",
			Description: err.Error(),
		})
	}

	return c.JSON(products)
}

func ListCategories(c *fiber.Ctx) error {
	categories, err := usecase.GetAllCategories()
	if err != nil {
		return c.Status(500).JSON(dto.ErrorResponse{
			Code:        500,
			Title:       "Internal Server Error",
			Description: err.Error(),
		})
	}

	return c.JSON(categories)
}
