// API Response types

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
  }
  
  export interface AuthResponse {
    access_token: string;
    user: User;
  }
  
  export interface LoginResponse {
    requires2fa: boolean;
    userId: string;
  }
  
  export interface RefreshResponse {
    access_token: string;
  }
  
  export interface ErrorResponse {
    code: number;
    title: string;
    description: string;
  }
  
  export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    old_price?: number;
    discount?: number;
    category_slug: string;
    image: string;
    is_new: boolean;
    is_premium: boolean;
    is_hot: boolean;
    stock: number;
    created_at: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
  }
  
  export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface Verify2FAPayload {
    userId: number;
    code: string;
  }