package domain

type User struct {
	ID                 int    `json:"id"`
	Name               string `json:"name"`
	Email              string `json:"email"`
	PasswordHash       string `json:"-"`
	Avatar             string `json:"avatar"`
	IsTwoFactorEnabled bool   `json:"is_two_factor_enabled"`
	TwoFactorSecret    string `json:"-"`
}
