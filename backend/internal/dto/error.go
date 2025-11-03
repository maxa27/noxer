package dto

type ErrorResponse struct {
	Code        int    `json:"code"`
	Title       string `json:"title"`
	Description string `json:"description"`
}
