import api from "./client";
import { API_ROUTES } from "./routes";
import type { Product, Category } from "../types/api";

export const productsApi = {
  getAll: () =>
    api.get<Product[]>(API_ROUTES.products.list).then((r) => r.data),

  search: (query: string) =>
    api
      .get<Product[]>(API_ROUTES.products.search, { params: { q: query } })
      .then((r) => r.data),

  getCategories: () =>
    api.get<Category[]>(API_ROUTES.categories.list).then((r) => r.data),
};