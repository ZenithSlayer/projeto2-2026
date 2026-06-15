import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const StorePage = lazy(() => import("./pages/StorePage"));

const isAuthenticated = () => !!localStorage.getItem("token");

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/error/401" replace />;
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    children
  );
};

const AppRouter = ({ setToast }) => {
  const { addToCart } = useCart();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/store" element={<StorePage />} />

      <Route
        path="/product/:id"
        element={<ProductPage onAddToCart={addToCart} setToast={setToast} />}
      />

      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage setToast={setToast} />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard setToast={setToast} />
          </ProtectedRoute>
        }
      />

      <Route path="/error/:statusCode" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/error/404" replace />} />
    </Routes>
  );
};

export default AppRouter;