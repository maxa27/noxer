import React, { useEffect } from "react";
import { useSearchStore } from "../../store/useSearchStore";
import { useDebounce } from "@shared/hooks/useDebounce";
import ProductCard from "../ProductCard";
import type { Product } from "../../types/api";
import styles from "./SearchResults.module.scss";

const popularSearches = ["Футболка", "Женская кофта", "Сертификат", "Кроссовки"];

interface SearchResultsProps {
  allProducts?: Product[]
  onSelect?: (item: string | Product) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ allProducts = [], onSelect }) => {
  const { query, results, loading, error, focused, setQuery, searchProducts } = useSearchStore();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  const handlePopularClick = (item: string) => {
    setQuery(item);
    onSelect?.(item);
  };

  return (
    <div className={styles.wrapper}>
      {!debouncedQuery && focused ? (
        <div className={styles.popularSearches}>
          <h3>Часто ищут:</h3>
          <ul>
            {popularSearches.map((item) => (
              <li key={item} onClick={() => handlePopularClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : error ? (
        <div className={styles.noResults}>{error}</div>
      ) : !results || results.length === 0 ? (
        <div className={styles.noResults}>Ничего не найдено по запросу "{debouncedQuery}"</div>
      ) : (
        <div className={styles.resultsGrid}>
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
