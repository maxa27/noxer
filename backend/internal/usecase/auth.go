package usecase

import (
	"errors"
	"fmt"
	"os"
	"time"

	"noxer-backend/internal/domain"
	"noxer-backend/internal/dto"
	"noxer-backend/internal/middleware"
	"noxer-backend/internal/repository"
	"noxer-backend/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(req dto.RegisterRequest) (dto.AuthResponse, error) {
	existingUser, _ := repository.FindUserByEmail(req.Email)
	if existingUser != nil {
		return dto.AuthResponse{}, errors.New("пользователь уже существует")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		return dto.AuthResponse{}, fmt.Errorf("ошибка хеширования: %w", err)
	}

	defaultAvatarPath := os.Getenv("DEFAULT_AVATAR_PATH")
	if defaultAvatarPath == "" {
		defaultAvatarPath = "/static/default_avatar.png"
	}

	user := domain.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hash),
		Avatar:       defaultAvatarPath,
	}

	savedUser, err := repository.CreateUser(user)
	if err != nil {
		return dto.AuthResponse{}, err
	}

	accessToken, err := middleware.GenerateAccessToken(savedUser.ID)
	if err != nil {
		return dto.AuthResponse{}, err
	}

	refreshToken, err := middleware.GenerateRefreshToken(savedUser.ID)
	if err != nil {
		return dto.AuthResponse{}, err
	}

	expiresAt := time.Now().Add(time.Hour * 24 * 7)
	err = repository.SaveRefreshToken(savedUser.ID, refreshToken, expiresAt)
	if err != nil {
		return dto.AuthResponse{}, err
	}

	userResponse := dto.UserResponse{
		ID:     savedUser.ID,
		Name:   savedUser.Name,
		Email:  savedUser.Email,
		Avatar: savedUser.Avatar,
	}

	return dto.AuthResponse{
		AccessToken: accessToken,
		User:        userResponse,
	}, nil
}

func LoginUser(req dto.LoginRequest) (dto.AuthResponse, string, error) {
	user, err := repository.FindUserByEmail(req.Email)
	if err != nil {
		return dto.AuthResponse{}, "", err
	}
	if user == nil {
		return dto.AuthResponse{}, "", fmt.Errorf("пользователь не найден")
	}

	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)) != nil {
		return dto.AuthResponse{}, "", fmt.Errorf("неверный пароль")
	}

	code := utils.Generate6DigitCode()

	err = repository.UpdateUser2FACode(user.ID, code)
	if err != nil {
		return dto.AuthResponse{}, "", err
	}

	smtpHost := os.Getenv("SMTP_HOST")
	if smtpHost == "" {
		smtpHost = "mailhog"
	}
	smtpPort := os.Getenv("SMTP_PORT")
	if smtpPort == "" {
		smtpPort = "1025"
	}
	emailFrom := os.Getenv("EMAIL_FROM")
	if emailFrom == "" {
		emailFrom = "no-reply@noxer.local"
	}

	_ = utils.SendEmail(smtpHost, smtpPort, emailFrom, user.Email, "Your login code", "Code: "+code)

	return dto.AuthResponse{}, fmt.Sprintf("%d", user.ID), nil
}

func Verify2FA(userID int, code string) (dto.AuthResponse, string, error) {
	user, secret, err := repository.GetUserWith2FASecret(userID)
	if err != nil {
		return dto.AuthResponse{}, "", err
	}

	if secret != code {
		return dto.AuthResponse{}, "", fmt.Errorf("неверный код")
	}

	err = repository.ClearUser2FACode(userID)
	if err != nil {
		return dto.AuthResponse{}, "", err
	}

	accessToken, err := middleware.GenerateAccessToken(user.ID)
	if err != nil {
		return dto.AuthResponse{}, "", err
	}

	refreshToken, err := middleware.GenerateRefreshToken(user.ID)
	if err != nil {
		return dto.AuthResponse{}, "", err
	}

	_ = repository.DeleteUserRefreshTokens(user.ID)

	expiresAt := time.Now().Add(time.Hour * 24 * 7)
	err = repository.SaveRefreshToken(user.ID, refreshToken, expiresAt)
	if err != nil {
		return dto.AuthResponse{}, "", err
	}

	userResponse := dto.UserResponse{
		ID:     user.ID,
		Name:   user.Name,
		Email:  user.Email,
		Avatar: user.Avatar,
	}

	return dto.AuthResponse{
		AccessToken: accessToken,
		User:        userResponse,
	}, refreshToken, nil
}

func RefreshAccessToken(refreshToken string) (string, error) {
	claims, err := middleware.ValidateToken(refreshToken)
	if err != nil {
		return "", errors.New("недействительный refresh token")
	}

	userID, err := repository.GetRefreshToken(refreshToken)
	if err != nil {
		return "", errors.New("refresh token не найден или истек")
	}

	if userID != claims.UserID {
		return "", errors.New("недействительный refresh token")
	}

	newAccessToken, err := middleware.GenerateAccessToken(userID)
	if err != nil {
		return "", err
	}

	return newAccessToken, nil
}

func LogoutUser(refreshToken string) error {
	return repository.DeleteRefreshToken(refreshToken)
}
