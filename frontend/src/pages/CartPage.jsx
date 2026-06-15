import React from "react";
import { useCart } from "../context/CartContext";
import "./style/CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const safeCart = Array.isArray(cart) ? cart : [];

  const total = safeCart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const handleDecrease = (item) => {
    const newQty = (item.quantity || 1) - 1;

    if (newQty < 1) return;

    updateQuantity(item.id, newQty);
  };

  const handleIncrease = (item) => {
    const newQty = (item.quantity || 1) + 1;
    updateQuantity(item.id, newQty);
  };

  const handleRemove = (item) => {
    if (!item?.id) return;
    removeFromCart(item.id);
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: safeCart,
          total,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      safeCart.forEach((item) => removeFromCart(item.id));
      alert("Order placed successfully!");
      
    } catch (err) {
      alert(err.message);
    }
  };

  if (safeCart.length === 0) {
    return <h2 className="cart-empty">Your cart is empty</h2>;
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {safeCart.map((item) => {
        if (!item?.id) return null;

        return (
          <div key={item.id} className="cart-item">
            <img src={item.image_url || ""} alt={item.name || "Product"} />

            <div>
              <h3>{item.name || "Unnamed product"}</h3>

              <p>${Number(item.price || 0).toFixed(2)}</p>

              <div className="quantity">
                <button onClick={() => handleDecrease(item)}>-</button>

                <span>{item.quantity || 1}</span>

                <button onClick={() => handleIncrease(item)}>+</button>
              </div>

              <button onClick={() => handleRemove(item)}>Remove</button>
            </div>
          </div>
        );
      })}

      <h2>Total: ${total.toFixed(2)}</h2>
      <button className="checkout-btn" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
};

export default CartPage;
