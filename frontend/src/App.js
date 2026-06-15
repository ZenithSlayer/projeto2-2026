import React, { useState } from "react";
import AppRouter from "./AppRouter";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

function App() {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [toast, setToast] = useState(null);

  return (
    <CartProvider>
      <BrowserRouter>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <Header toggleSidebar={() => setSidebarStatus(!sidebarStatus)} />

        <div style={{ display: "flex" }}>
          <Sidebar isOpen={sidebarStatus} />

          <main>
            <AppRouter setToast={setToast} />
          </main>
        </div>

        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
