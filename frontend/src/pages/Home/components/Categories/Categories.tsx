import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay} from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "./Swiper.scss";
import type { Category } from "../../../../types/api";
import styles from "./Categories.module.scss";

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <div className={styles.categoriesContainer}>
      <Swiper
        modules={[FreeMode, Autoplay]}
        spaceBetween={10}
        slidesPerView="auto"
        freeMode={true}
        grabCursor={true}
        loop={true} // чтобы не останавливался в конце
        speed={5000} // скорость движения (меньше = быстрее)
        autoplay={{
          delay: 0, // без паузы
          disableOnInteraction: false, // не останавливается при наведении
        }}
        className={styles.swiper} 
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id} className={styles.slide}>
            <div className={styles.categoryCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={category.image || "/images/categories/default.jpg"}
                  alt={category.name}
                  className={styles.image}
                />
              </div>
              <p className={styles.name}>{category.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Categories;