package repository

import (
	"database/sql"
	"fmt"
	"time"

	"noxer-backend/internal/db"
	"noxer-backend/internal/domain"
)

func CreateUser(u domain.User) (*domain.User, error) {
	query := `
		INSERT INTO users (name, email, password_hash, avatar)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, email, avatar
	`
	row := db.DB.QueryRow(query, u.Name, u.Email, u.PasswordHash, u.Avatar)

	var user domain.User
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Avatar)
	if err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}

	return &user, nil
}

func FindUserByEmail(email string) (*domain.User, error) {
	query := `
		SELECT id, name, email, password_hash, avatar, is_two_factor_enabled
		FROM users
		WHERE email = $1
	`
	row := db.DB.QueryRow(query, email)

	var user domain.User
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.PasswordHash, &user.Avatar, &user.IsTwoFactorEnabled)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("find user by email: %w", err)
	}

	return &user, nil
}

func GetUserByID(id int) (*domain.User, error) {
	query := `
		SELECT id, name, email, avatar
		FROM users
		WHERE id = $1
	`
	row := db.DB.QueryRow(query, id)

	var user domain.User
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Avatar)
	if err != nil {
		return nil, fmt.Errorf("get user by id: %w", err)
	}

	return &user, nil
}

func UpdateUser2FACode(userID int, code string) error {
	query := `UPDATE users SET two_factor_secret = $1 WHERE id = $2`
	_, err := db.DB.Exec(query, code, userID)
	return err
}

func GetUserWith2FASecret(userID int) (*domain.User, string, error) {
	query := `
		SELECT id, name, email, avatar, two_factor_secret
		FROM users
		WHERE id = $1
	`
	row := db.DB.QueryRow(query, userID)

	var user domain.User
	var secret sql.NullString
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Avatar, &secret)
	if err != nil {
		return nil, "", fmt.Errorf("get user with 2fa: %w", err)
	}

	if !secret.Valid {
		return &user, "", nil
	}

	return &user, secret.String, nil
}

func ClearUser2FACode(userID int) error {
	query := `UPDATE users SET two_factor_secret = NULL WHERE id = $1`
	_, err := db.DB.Exec(query, userID)
	return err
}

func SaveRefreshToken(userID int, token string, expiresAt time.Time) error {
	query := `
		INSERT INTO refresh_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
	`
	_, err := db.DB.Exec(query, userID, token, expiresAt)
	return err
}

func GetRefreshToken(token string) (int, error) {
	var userID int
	query := `
		SELECT user_id
		FROM refresh_tokens
		WHERE token = $1 AND expires_at > NOW()
	`
	err := db.DB.QueryRow(query, token).Scan(&userID)
	if err == sql.ErrNoRows {
		return 0, fmt.Errorf("token not found or expired")
	}
	return userID, err
}

func DeleteRefreshToken(token string) error {
	query := `DELETE FROM refresh_tokens WHERE token = $1`
	_, err := db.DB.Exec(query, token)
	return err
}

func DeleteUserRefreshTokens(userID int) error {
	query := `DELETE FROM refresh_tokens WHERE user_id = $1`
	_, err := db.DB.Exec(query, userID)
	return err
}

func CleanExpiredTokens() error {
	query := `DELETE FROM refresh_tokens WHERE expires_at <= NOW()`
	_, err := db.DB.Exec(query)
	return err
}
