package dto

type AuthResponse struct {
	AccessToken string       `json:"access_token"`
	User        UserResponse `json:"user"`
}

type RefreshResponse struct {
	AccessToken string `json:"access_token"`
}

type Verify2FARequest struct {
	UserID int    `json:"userId"`
	Code   string `json:"code"`
}
