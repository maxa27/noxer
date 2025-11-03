package repository

import (
	"fmt"
	"noxer-backend/internal/db"
	"noxer-backend/internal/domain"
)

func GetAllProducts() ([]domain.Product, error) {
	query := `
		SELECT id, title, description, price, 
		       COALESCE(old_price, 0) as old_price, 
		       COALESCE(discount, 0) as discount,
		       category_slug, image, is_new, is_premium, is_hot, 
		       COALESCE(stock, 0) as stock, 
		       created_at
		FROM products
		ORDER BY created_at DESC
	`
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("get all products: %w", err)
	}
	defer rows.Close()

	var products []domain.Product
	for rows.Next() {
		var p domain.Product
		if err := rows.Scan(
			&p.ID, &p.Title, &p.Description, &p.Price,
			&p.OldPrice, &p.Discount, &p.CategorySlug, &p.Image,
			&p.IsNew, &p.IsPremium, &p.IsHot, &p.Stock, &p.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan product: %w", err)
		}
		products = append(products, p)
	}

	return products, nil
}

func SearchProducts(query string) ([]domain.Product, error) {
	searchQuery := `
		SELECT id, title, description, price, 
		       COALESCE(old_price, 0) as old_price, 
		       COALESCE(discount, 0) as discount,
		       category_slug, image, is_new, is_premium, is_hot, 
		       COALESCE(stock, 0) as stock, 
		       created_at
		FROM products
		WHERE to_tsvector('russian', title || ' ' || COALESCE(description, '')) @@ plainto_tsquery('russian', $1)
		   OR title ILIKE '%' || $1 || '%'
		ORDER BY 
			CASE 
				WHEN title ILIKE $1 || '%' THEN 1
				WHEN title ILIKE '%' || $1 || '%' THEN 2
				ELSE 3
			END,
			created_at DESC
		LIMIT 50
	`

	rows, err := db.DB.Query(searchQuery, query)
	if err != nil {
		return nil, fmt.Errorf("search products: %w", err)
	}
	defer rows.Close()

	var products []domain.Product
	for rows.Next() {
		var p domain.Product
		if err := rows.Scan(
			&p.ID, &p.Title, &p.Description, &p.Price,
			&p.OldPrice, &p.Discount, &p.CategorySlug, &p.Image,
			&p.IsNew, &p.IsPremium, &p.IsHot, &p.Stock, &p.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan product: %w", err)
		}
		products = append(products, p)
	}

	return products, nil
}

func GetAllCategories() ([]domain.Category, error) {
	query := `SELECT id, name, slug, COALESCE(image, '') as image FROM categories ORDER BY id`
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("get all categories: %w", err)
	}
	defer rows.Close()

	var categories []domain.Category
	for rows.Next() {
		var c domain.Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.Image); err != nil {
			return nil, fmt.Errorf("scan category: %w", err)
		}
		categories = append(categories, c)
	}

	return categories, nil
}
