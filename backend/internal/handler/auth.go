package handler

import (
	"noxer-backend/internal/dto"
	"noxer-backend/internal/usecase"

	"github.com/gofiber/fiber/v2"
)

func RegisterUser(c *fiber.Ctx) error {
	var req dto.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(dto.ErrorResponse{
			Code:        400,
			Title:       "Bad Request",
			Description: "Невалидный JSON",
		})
	}

	authResponse, err := usecase.RegisterUser(req)
	if err != nil {
		return c.Status(500).JSON(dto.ErrorResponse{
			Code:        500,
			Title:       "Register Failed",
			Description: err.Error(),
		})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		HTTPOnly: true,
		Path:     "/",
	})

	return c.Status(201).JSON(authResponse)
}

func LoginUser(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(dto.ErrorResponse{
			Code:        400,
			Title:       "Bad Request",
			Description: "Невалидный JSON",
		})
	}

	_, userIdStr, err := usecase.LoginUser(req)
	if err != nil {
		return c.Status(401).JSON(dto.ErrorResponse{
			Code:        401,
			Title:       "Login Failed",
			Description: err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"requires2fa": true,
		"userId":      userIdStr,
	})
}

func Verify2FA(c *fiber.Ctx) error {
	var req dto.Verify2FARequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(dto.ErrorResponse{
			Code:        400,
			Title:       "Bad Request",
			Description: "Невалидный JSON",
		})
	}

	authResponse, refreshToken, err := usecase.Verify2FA(req.UserID, req.Code)
	if err != nil {
		return c.Status(401).JSON(dto.ErrorResponse{
			Code:        401,
			Title:       "Invalid Code",
			Description: err.Error(),
		})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HTTPOnly: true,
		Secure:   true,
		Path:     "/",
		MaxAge:   7 * 24 * 3600,
		SameSite: "None",
	})

	return c.JSON(authResponse)
}

func RefreshToken(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return c.Status(401).JSON(dto.ErrorResponse{
			Code:        401,
			Title:       "Unauthorized",
			Description: "Refresh token не найден",
		})
	}

	newAccessToken, err := usecase.RefreshAccessToken(refreshToken)
	if err != nil {
		c.Cookie(&fiber.Cookie{
			Name:   "refresh_token",
			Value:  "",
			MaxAge: -1,
		})
		return c.Status(401).JSON(dto.ErrorResponse{
			Code:        401,
			Title:       "Unauthorized",
			Description: err.Error(),
		})
	}

	return c.JSON(dto.RefreshResponse{
		AccessToken: newAccessToken,
	})
}

func LogoutUser(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken != "" {
		_ = usecase.LogoutUser(refreshToken)
	}

	c.Cookie(&fiber.Cookie{
		Name:   "refresh_token",
		Value:  "",
		MaxAge: -1,
	})

	return c.JSON(fiber.Map{
		"message": "Успешный выход",
	})
}
