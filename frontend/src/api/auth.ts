import api from "./client";
import { API_ROUTES } from "./routes";
import type {
  RegisterPayload,
  LoginPayload,
  Verify2FAPayload,
  AuthResponse,
  LoginResponse,
  RefreshResponse,
} from "../types/api";

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>(API_ROUTES.auth.register, payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    api.post<LoginResponse>(API_ROUTES.auth.login, payload).then((r) => r.data),

  verify2fa: (payload: Verify2FAPayload) =>
    api.post<AuthResponse>(API_ROUTES.auth.verify2fa, payload).then((r) => r.data),

  refresh: () =>
    api.post<RefreshResponse>(API_ROUTES.auth.refresh).then((r) => r.data),

  logout: () => api.post(API_ROUTES.auth.logout).then((r) => r.data),
};