import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BottomNav.module.scss";
import {Home, Catalog, Heart, Basket, Profile} from '@shared/icons'


const BottomNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.bottomNav}>
      <button className={styles.navItem} onClick={() => navigate("/")}>
        <span className={styles.icon}><Home/></span>
      </button>

      <button className={styles.navItem}>
        <span className={styles.icon}><Catalog/></span>
      </button>

      <button className={styles.navItem}>
        <span className={styles.icon}><Heart/></span>
      </button>

      <button className={styles.navItem}>
        <span className={styles.icon}><Basket/></span>
      </button>

      <button className={styles.navItem}>
        <span className={styles.icon}><Profile/></span>
      </button>
    </nav>
  );
};

export default BottomNav;