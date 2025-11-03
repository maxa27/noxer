import { useState, useEffect } from "react";

/**
 * Хук debounce — возвращает задержанное значение после указанного времени.
 * Используется, чтобы не дергать API на каждый ввод символа.
 *
 * @param value - значение, которое нужно «дебаунсить»
 * @param delay - задержка в миллисекундах (по умолчанию 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // очистка таймаута при изменении value или размонтировании
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
