export const API_ROUTES = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    verify2fa: "/auth/2fa/verify",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  products: {
    list: "/products",
    search: "/products/search",
  },
  categories: {
    list: "/categories",
  },
} as const;