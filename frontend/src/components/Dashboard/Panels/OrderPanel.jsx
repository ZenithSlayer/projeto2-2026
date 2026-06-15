import React from "react";

export const OrderPanel = ({ orders }) => {
  return (
    <div className="panel">
      <h2>Order History</h2>
      <div className="item-list">
        {orders.length === 0 ? (
          <p className="empty-message">You haven't placed any orders yet.</p>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="item order-item">
              <div className="order-header">
                <span className="order-id">Order #{o.id}</span>
                <span className={`status-badge ${o.status.toLowerCase()}`}>
                  {o.status}
                </span>
              </div>
              <div className="order-footer">
                <span>Total: <strong>${o.total}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};