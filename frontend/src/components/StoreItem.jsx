import React from "react";
import "./style/StoreItem.css";
import { useNavigate } from "react-router-dom";
import placeHolder from '../assets/placeHolder.png';

const StoreItem = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      className="store-item"
      onClick={() => navigate(`/product/${item.id}`, { replace: true })}
    >
      <img src={item.image_url || placeHolder} alt={item.name} />
      <h3>{item.name}</h3>
      <p className="description">{item.description}</p>
      <p className="price">${item.price}</p>
    </div>
  );
};

export default StoreItem;
