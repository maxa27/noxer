package middleware

import (
	"errors"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID int `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateAccessToken(userID int) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "replace_jwt"
	}

	accessExpires := os.Getenv("ACCESS_EXPIRES")
	if accessExpires == "" {
		accessExpires = "15m"
	}

	duration, err := time.ParseDuration(accessExpires)
	if err != nil {
		duration = 15 * time.Minute
	}

	claims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

func GenerateRefreshToken(userID int) (string, error) {
	refreshSecret := os.Getenv("REFRESH_SECRET")
	if refreshSecret == "" {
		refreshSecret = "replace_refresh"
	}

	refreshExpires := os.Getenv("REFRESH_EXPIRES")
	if refreshExpires == "" {
		refreshExpires = "168h"
	}

	duration, err := time.ParseDuration(refreshExpires)
	if err != nil {
		duration = 168 * time.Hour
	}

	claims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(refreshSecret))
}

func ValidateToken(tokenString string) (*Claims, error) {
	refreshSecret := os.Getenv("REFRESH_SECRET")
	if refreshSecret == "" {
		refreshSecret = "replace_refresh"
	}

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(refreshSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

func RequireAuth(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{
			"code":        401,
			"title":       "Unauthorized",
			"description": "Authorization header отсутствует",
		})
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return c.Status(401).JSON(fiber.Map{
			"code":        401,
			"title":       "Unauthorized",
			"description": "Неверный формат токена",
		})
	}

	tokenString := parts[1]
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "replace_jwt"
	}

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{
			"code":        401,
			"title":       "Unauthorized",
			"description": "Недействительный токен",
		})
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return c.Status(401).JSON(fiber.Map{
			"code":        401,
			"title":       "Unauthorized",
			"description": "Невалидные claims",
		})
	}

	c.Locals("userID", claims.UserID)
	return c.Next()
}
