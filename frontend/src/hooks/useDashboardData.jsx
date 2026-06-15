import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const useDashboardData = (setToast) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    user: null,
    orders: [],
    addresses: [],
    cards: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (!localStorage.getItem("token")) return navigate("/login");
      const res = await api.get("/users/me");
      setData(prev => ({ ...prev, ...res, user: res.user }));
      
      if (res.user?.is_admin) {
        const prodRes = await api.get("/products");
        setData(prev => ({ ...prev, products: prodRes }));
      }
    } catch (err) {
      setToast({ message: "Failed to load dashboard", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  
  // eslint-disable-next-line
  useEffect(() => { fetchData(); }, []);

  return { data, setData, loading, reload: fetchData };
};