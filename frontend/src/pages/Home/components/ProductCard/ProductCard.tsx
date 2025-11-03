import React, { useState } from "react";
import type { Product } from "../../../../types/api";
import styles from "./ProductCard.module.scss";
import { Heart, LikedHeart } from "@shared/icons";
import { priceFormat } from "@shared/hooks/priceFormat";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={product.image || "/images/products/placeholder.jpg"}
          alt={product.title}
          className={styles.image}
        />

        <div className={styles.badges}>
          {product.is_hot && (
            <span className={`${styles.badge} ${styles.hot}`}>ХИТ</span>
          )}
          {product.is_new && (
            <span className={`${styles.badge} ${styles.new}`}>NEW</span>
          )}
          {product.is_premium && (
            <span className={`${styles.badge} ${styles.premium}`}>ПРЕМИУМ</span>
          )}
          {product.discount && product.discount > 0 && (
            <span className={`${styles.badge} ${styles.sale}`}>SALE</span>
          )}
        </div>

        <button
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ""}`}
          onClick={toggleFavorite}
        >
          {isFavorite ? (
            <LikedHeart styles={{ svg: styles.likedSvg }} />
          ) : (
            <Heart />
          )}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.priceBlock}>
          <span className={styles.price}>{priceFormat(product.price)} ₽</span>
          {product.old_price && product.old_price > 0 && (
            <span className={styles.oldPrice}>
              {priceFormat(product.old_price)} ₽
            </span>
          )}
          {product.discount && product.discount > 0 && (
            <span className={styles.discount}>-{product.discount}%</span>
          )}
        </div>

        <h4 className={styles.title}>{product.title}</h4>

        <button className={styles.selectBtn}>Выбрать</button>
      </div>
    </div>
  );
};

export default ProductCard;
