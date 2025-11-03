import React from "react";
import type { Product } from "../../types/api";
import styles from "./ProductCard.module.scss";
import { priceFormat } from "@shared/hooks/priceFormat";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => (
  <div className={styles.card} onClick={onClick}>
    <div className={styles.imageWrapper}>
      <img src={product.image || "/placeholder.png"} alt={product.title} />
    </div>
    <div className={styles.content}>
      <div className={styles.title}>{product.title}</div>
      <div className={styles.priceContainer}>
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
    </div>
  </div>
);

export default ProductCard;
