package dto

type CategoryResponse struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Image string `json:"image"`
}
