import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Verify2FA from "./pages/Verify2FA";
import Home from "./pages/Home";
import Layout from "./layout/Layout";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {

  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-2fa" element={<Verify2FA />} />

        {/* Все защищённые маршруты через Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          {/* сюда можно добавлять другие защищённые страницы */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
