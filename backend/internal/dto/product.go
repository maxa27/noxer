package dto

type ProductResponse struct {
	ID           int     `json:"id"`
	Title        string  `json:"title"`
	Description  string  `json:"description"`
	Price        float64 `json:"price"`
	OldPrice     float64 `json:"old_price,omitempty"`
	Discount     int     `json:"discount,omitempty"`
	CategorySlug string  `json:"category_slug"`
	Image        string  `json:"image"`
	IsNew        bool    `json:"is_new"`
	IsPremium    bool    `json:"is_premium"`
	IsHot        bool    `json:"is_hot"`
	Stock        int     `json:"stock"`
	CreatedAt    string  `json:"created_at"`
}
