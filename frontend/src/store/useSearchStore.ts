// store/useSearchStore.ts
import { create } from "zustand";
import { productsApi } from "../api/products";
import type { Product } from "../types/api";

interface SearchState {
  query: string;
  focused: boolean;
  results: Product[];
  loading: boolean;
  error: string | null;
  
  setQuery: (query: string) => void;
  setFocused: (focused: boolean) => void;
  clear: () => void;
  
  searchProducts: (query: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  focused: false,
  results: [],
  loading: false,
  error: null,

  setQuery: (query) => set({ query }),
  setFocused: (focused) => set({ focused }),
  clear: () => set({ query: "", focused: false, results: [], loading: false, error: null }),

  searchProducts: async (query) => {
    if (!query.trim()) return set({ results: [], loading: false, error: null });
    set({ loading: true, error: null });
    try {
      const data = await productsApi.search(query);
      set({ results: data, loading: false });
    } catch (err) {
      set({ error: "Ошибка при поиске", loading: false });
    }
  },
}));
