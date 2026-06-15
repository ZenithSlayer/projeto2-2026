import React from "react";
import StoreItem from "../components/StoreItem";
import "./style/ItemRow.css";

const ItemRow = ({ products = [] }) => {
  return (
    <div className="products-grid">
      {products.map((item) => (
        <StoreItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ItemRow;