package db

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
)

type ProductSeed struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	OldPrice    float64 `json:"old_price"`
	Discount    int     `json:"discount"`
	Category    string  `json:"category"`
	Image       string  `json:"image"`
	IsNew       bool    `json:"is_new"`
	IsPremium   bool    `json:"is_premium"`
	IsHot       bool    `json:"is_hot"`
	Stock       int     `json:"stock"`
}

func Seed() error {
	if Pool == nil {
		return errors.New("db not initialized")
	}
	ctx := context.Background()

	// Seed categories
	_, err := Pool.Exec(ctx, `
		INSERT INTO categories (name, slug, image) VALUES
		('Аксессуары', 'accessories', '/images/categories/accessories.jpg'),
		('Футболки', 'tshirts', '/images/categories/tshirts.jpg'),
		('Толстовки', 'hoodies', '/images/categories/hoodies.jpg'),
		('Куртки', 'jackets', '/images/categories/jackets.jpg'),
		('Сертификаты', 'certificates', '/images/categories/certificates.jpg'),
		('Брюки', 'pants', '/images/categories/pants.jpg'),
		('Головные уборы', 'hats', '/images/categories/hats.jpg')
		ON CONFLICT (slug) DO NOTHING;
	`)
	if err != nil {
		return fmt.Errorf("seed categories: %w", err)
	}

	// Load products from JSON if exists
	if _, err := os.Stat("./seed_products.json"); err == nil {
		return seedFromJSON(ctx)
	}

	// Default seed
	return seedDefault(ctx)
}

func seedFromJSON(ctx context.Context) error {
	data, err := os.ReadFile("./seed_products.json")
	if err != nil {
		return fmt.Errorf("read seed file: %w", err)
	}

	var products []ProductSeed
	if err := json.Unmarshal(data, &products); err != nil {
		return fmt.Errorf("parse seed file: %w", err)
	}

	for _, p := range products {
		_, err := Pool.Exec(ctx, `
			INSERT INTO products (title, description, price, old_price, discount, category_slug, image, is_new, is_premium, is_hot, stock)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			ON CONFLICT DO NOTHING
		`, p.Title, p.Description, p.Price, p.OldPrice, p.Discount, p.Category, p.Image, p.IsNew, p.IsPremium, p.IsHot, p.Stock)
		if err != nil {
			return fmt.Errorf("insert product: %w", err)
		}
	}

	fmt.Printf("✅ Seeded %d products from JSON\n", len(products))
	return nil
}

func seedDefault(ctx context.Context) error {
	products := []ProductSeed{
		// Футболки
		{Title: "Футболка мужская Комары", Description: "Лёгкая футболка с принтом комаров", Price: 4995, OldPrice: 7000, Discount: 30, Category: "tshirts", Image: "/images/products/tshirt-komary.jpg", IsHot: true, Stock: 50},
		{Title: "Футболка женская Yamal", Description: "Базовая женская футболка", Price: 3500, OldPrice: 0, Discount: 0, Category: "tshirts", Image: "/images/products/tshirt-yamal-woman.jpg", IsNew: false, Stock: 30},
		{Title: "Футболка мужская Logo", Description: "Футболка с большим логотипом", Price: 2800, OldPrice: 3500, Discount: 20, Category: "tshirts", Image: "/images/products/tshirt-logo.jpg", IsHot: false, Stock: 45},
		{Title: "Футболка оверсайз", Description: "Свободная футболка", Price: 4200, OldPrice: 0, Discount: 0, Category: "tshirts", Image: "/images/products/tshirt-oversize.jpg", IsNew: true, Stock: 25},

		// Толстовки
		{Title: "Свитшот женский укороченный", Description: "Укороченный свитшот Yamal", Price: 2700, OldPrice: 3000, Discount: 10, Category: "hoodies", Image: "/images/products/hoodie-woman-short.jpg", IsPremium: true, Stock: 20},
		{Title: "Худи мужское черное", Description: "Классическое черное худи", Price: 5500, OldPrice: 0, Discount: 0, Category: "hoodies", Image: "/images/products/hoodie-black.jpg", IsNew: false, Stock: 40},
		{Title: "Свитшот серый меланж", Description: "Комфортный свитшот", Price: 4800, OldPrice: 6000, Discount: 20, Category: "hoodies", Image: "/images/products/sweatshirt-grey.jpg", IsHot: false, Stock: 35},

		// Куртки
		{Title: "Куртка ветровка", Description: "Легкая ветровка", Price: 8500, OldPrice: 10000, Discount: 15, Category: "jackets", Image: "/images/products/jacket-windbreaker.jpg", IsNew: true, Stock: 15},
		{Title: "Бомбер черный", Description: "Классический бомбер", Price: 9500, OldPrice: 0, Discount: 0, Category: "jackets", Image: "/images/products/bomber-black.jpg", IsPremium: false, Stock: 12},

		// Брюки
		{Title: "Брюки широкие джинсовые", Description: "Широкие джинсы", Price: 6500, OldPrice: 0, Discount: 0, Category: "pants", Image: "/images/products/pants-wide.jpg", IsNew: false, Stock: 30},
		{Title: "Шорты мужские Yamal", Description: "Спортивные шорты", Price: 3850, OldPrice: 0, Discount: 0, Category: "pants", Image: "/images/products/shorts-yamal.jpg", IsNew: true, Stock: 40},

		// Головные уборы
		{Title: "Шапка Yamal комбинация с бубоном", Description: "Теплая зимняя шапка", Price: 1550, OldPrice: 0, Discount: 0, Category: "hats", Image: "/images/products/hat-yamal-beanie.jpg", IsNew: true, Stock: 60},
		{Title: "Кепка черная", Description: "Бейсболка с вышивкой", Price: 1200, OldPrice: 1500, Discount: 20, Category: "hats", Image: "/images/products/cap-black.jpg", IsHot: false, Stock: 50},

		// Аксессуары
		{Title: "Брелок фирменный Созвездие", Description: "Металлический брелок с гравировкой", Price: 640, OldPrice: 800, Discount: 20, Category: "accessories", Image: "/images/products/keychain-constellation.jpg", IsHot: true, Stock: 100},
		{Title: "Стикерпак Yamal", Description: "Набор стикеров 10 шт", Price: 450, OldPrice: 0, Discount: 0, Category: "accessories", Image: "/images/products/stickers-pack.jpg", IsNew: false, Stock: 200},
		{Title: "Значок металлический", Description: "Коллекционный значок", Price: 350, OldPrice: 0, Discount: 0, Category: "accessories", Image: "/images/products/pin-metal.jpg", IsNew: false, Stock: 150},

		// Сертификаты
		{Title: "Сертификат Yamal 10000", Description: "Подарочный сертификат на 10000₽", Price: 10000, OldPrice: 0, Discount: 0, Category: "certificates", Image: "/images/products/certificate-10000.jpg", IsPremium: true, Stock: 999},
		{Title: "Сертификат Yamal 5000", Description: "Подарочный сертификат на 5000₽", Price: 5000, OldPrice: 0, Discount: 0, Category: "certificates", Image: "/images/products/certificate-5000.jpg", IsPremium: true, Stock: 999},
		{Title: "Сертификат Yamal 3000", Description: "Подарочный сертификат на 3000₽", Price: 3000, OldPrice: 0, Discount: 0, Category: "certificates", Image: "/images/products/certificate-3000.jpg", IsPremium: false, Stock: 999},
	}

	for _, p := range products {
		_, err := Pool.Exec(ctx, `
			INSERT INTO products (title, description, price, old_price, discount, category_slug, image, is_new, is_premium, is_hot, stock)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			ON CONFLICT DO NOTHING
		`, p.Title, p.Description, p.Price, p.OldPrice, p.Discount, p.Category, p.Image, p.IsNew, p.IsPremium, p.IsHot, p.Stock)
		if err != nil {
			return fmt.Errorf("insert product: %w", err)
		}
	}

	fmt.Printf("✅ Seeded %d products\n", len(products))
	return nil
}
