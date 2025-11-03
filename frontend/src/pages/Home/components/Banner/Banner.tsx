import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./Banner.module.scss";

const Banner: React.FC = () => {
  const banners = [
    {
      id: 1,
      title: "ВСЕМ КЛИЕНТАМ ДАРИМ 500 РУБ.",
      subtitle: "на первый заказ в телеграм-боте",
      buttonText: "Подробнее",
      image: "/images/banners/banner1.jpg",
    },
  ];

  return (
    <div className={styles.bannerContainer}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className={styles.swiper}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={styles.banner}>
              <div className={styles.content}>
                <h2 className={styles.title}>{banner.title}</h2>
                <p className={styles.subtitle}>{banner.subtitle}</p>
                <button className={styles.button}>{banner.buttonText}</button>
              </div>
              <div className={styles.image}>
                <img src={banner.image} alt={banner.title} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;