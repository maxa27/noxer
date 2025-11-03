import React, { useState } from "react";
import { useSearchStore } from "../../store/useSearchStore";
import styles from "./Header.module.scss";
import { Telegram, Dots, Basket } from "@shared/icons";
import SearchResults from "../SearchResults";
import type { Product } from "../../types/api";

const Header: React.FC = () => {
  const { query, setQuery, focused, setFocused, clear } = useSearchStore();
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setQuery(value);
  };

  const handleFocus = () => setFocused(true);

  const handleClose = () => {
    setFocused(false);
    setSearchValue("");
    clear();
  };

  const handleSelect = (item: string | Product) => {
    if (typeof item === "string") {
      setSearchValue(item);
      setQuery(item);
    } else {
      console.log("Перейти к товару:", item);
    }
    setFocused(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <button className={styles.closeButton} onClick={handleClose}>
          {focused ? "← Назад" : "✕ Закрыть"}
        </button>

        <div className={styles.channelLink}>
          <Telegram />
          <span>наш tg-канал</span>
        </div>

        <button className={styles.menuButton}> <Dots /></button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Найти товары"
          value={searchValue}
          onFocus={handleFocus}
          onChange={handleChange}
          className={styles.searchInput}
        />
      </div>
    </header>
  );
};

export default Header;
