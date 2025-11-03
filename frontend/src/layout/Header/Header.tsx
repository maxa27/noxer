import React, { useState } from "react";
import { useSearchStore } from "../../store/useSearchStore";
import styles from "./Header.module.scss";
import { Telegram, Dots } from "@shared/icons";

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

        <button className={styles.menuButton}>
          {" "}
          <Dots />
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Найти товары"
          value={query || searchValue}
          onFocus={handleFocus}
          onChange={handleChange}
          className={styles.searchInput}
        />
      </div>
    </header>
  );
};

export default Header;
