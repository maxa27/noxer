import React from "react";
import type { Product } from "../../types/api";
import styles from "./ProductCard.module.scss";

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
      <div className={styles.price}>{product.price} ₽</div>
    </div>
  </div>
);

export default ProductCard;
