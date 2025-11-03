import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productsApi } from "../../api/products";
import { useAuthStore } from "../../store/useAuthStore";
import { useSearchStore } from "../../store/useSearchStore";
import type { Product, Category } from "../../types/api";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import ProductCard from "./components/ProductCard";
import SearchResults from "../../layout/SearchResults";
import styles from "./Home.module.scss";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { query, focused } = useSearchStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsApi.getAll(),
        productsApi.getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Если поиск активен, показываем SearchResults вместо основного контента */}
      {focused || query ? (
        <SearchResults allProducts={products} /> 
        /* передаем текущие продукты для фильтрации или API поиска */
      ) : (
        <>
          <Banner />
          <Categories categories={categories} />
          <div className={styles.productsSection}>
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </>
      )}

      <footer className={styles.footer}>
        <p>Разработано на платформе Noxer</p>
        <a href="https://t.me/noxeral_bot" target="_blank" rel="noopener noreferrer">
          @noxeral_bot
        </a>
      </footer>
    </div>
  );
};

export default Home;
