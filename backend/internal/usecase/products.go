package usecase

import (
	"noxer-backend/internal/dto"
	"noxer-backend/internal/repository"
)

func GetAllProducts() ([]dto.ProductResponse, error) {
	products, err := repository.GetAllProducts()
	if err != nil {
		return nil, err
	}

	var response []dto.ProductResponse
	for _, p := range products {
		response = append(response, dto.ProductResponse{
			ID:           p.ID,
			Title:        p.Title,
			Description:  p.Description,
			Price:        p.Price,
			OldPrice:     p.OldPrice,
			Discount:     p.Discount,
			CategorySlug: p.CategorySlug,
			Image:        p.Image,
			IsNew:        p.IsNew,
			IsPremium:    p.IsPremium,
			IsHot:        p.IsHot,
			Stock:        p.Stock,
			CreatedAt:    p.CreatedAt,
		})
	}

	return response, nil
}

func SearchProducts(query string) ([]dto.ProductResponse, error) {
	products, err := repository.SearchProducts(query)
	if err != nil {
		return nil, err
	}

	var response []dto.ProductResponse
	for _, p := range products {
		response = append(response, dto.ProductResponse{
			ID:           p.ID,
			Title:        p.Title,
			Description:  p.Description,
			Price:        p.Price,
			OldPrice:     p.OldPrice,
			Discount:     p.Discount,
			CategorySlug: p.CategorySlug,
			Image:        p.Image,
			IsNew:        p.IsNew,
			IsPremium:    p.IsPremium,
			IsHot:        p.IsHot,
			Stock:        p.Stock,
			CreatedAt:    p.CreatedAt,
		})
	}

	return response, nil
}

func GetAllCategories() ([]dto.CategoryResponse, error) {
	categories, err := repository.GetAllCategories()
	if err != nil {
		return nil, err
	}

	var response []dto.CategoryResponse
	for _, c := range categories {
		response = append(response, dto.CategoryResponse{
			ID:    c.ID,
			Name:  c.Name,
			Slug:  c.Slug,
			Image: c.Image,
		})
	}

	return response, nil
}
