import React, { useState } from "react";
import { useDashboardData } from "../hooks/useDashboardData"; 
import { AddressPanel } from "../components/Dashboard/Panels/AddressPanel";
import { CardPanel } from "../components/Dashboard/Panels/CardPanel";
import { ProductPanel } from "../components/Dashboard/Panels/ProductPanel";
import { OrderPanel } from "../components/Dashboard/Panels/OrderPanel";
import { AccountPanel } from "../components/Dashboard/Panels/AccountPanel";
import "./style/Dashboard.css";

const Dashboard = ({ setToast }) => {
  const { data, setData, loading } = useDashboardData(setToast);
  const [activeTab, setActiveTab] = useState("account");

  if (loading) return <div className="container">Loading Dashboard...</div>;

  const tabs = ["account", "orders", "addresses", "cards"];
  if (data.user?.is_admin) tabs.push("products");

  const renderActivePanel = () => {
    const props = { data, setData, setToast };
    switch (activeTab) {
      case "account":   return <AccountPanel {...props} />;
      case "addresses": return <AddressPanel {...props} />;
      case "cards":     return <CardPanel {...props} />;
      case "products":  return <ProductPanel {...props} />;
      default:          return <OrderPanel orders={data.orders} />;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {data.user?.name || "User"}!</h1>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="tab-content">
        {renderActivePanel()}
      </main>
    </div>
  );
};

export default Dashboard;