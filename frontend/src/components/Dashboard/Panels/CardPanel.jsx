import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { api } from "../../../services/api";

export const CardPanel = ({ data, setData, setToast }) => {
  const [form, setForm] = useState({
    card_number: "",
    security_code: "",
    expiration_date: ""
  });

  // Safe access to cards with a fallback to an empty array
  const cards = data?.cards || [];

  const handleFavorite = async (id) => {
    try {
      await api.put(`/users/card/${id}/favorite`);
      setData(prev => ({
        ...prev,
        cards: prev.cards.map(c => 
          c ? { ...c, is_favorite: c.id === id ? 1 : 0 } : c
        )
      }));
      setToast({ message: "Favorite card updated", type: "success" });
    } catch {
      setToast({ message: "Failed to update favorite", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/card/${id}`);
      setData(prev => ({
        ...prev,
        cards: prev.cards.filter(c => c && c.id !== id)
      }));
    } catch {
      setToast({ message: "Error deleting card", type: "error" });
    }
  };

  const handleSubmit = async (input) => {
    input.preventDefault();
    if (form.card_number.length < 16) {
      return setToast({ message: "Card number must be 16 digits", type: "error" });
    }

    try {
      const res = await api.post("/users/card", form);
      
      // FIX: Since your backend doesn't return the new card object,
      // we need to trigger a fresh fetch or manually construct the item.
      // Ideally, the backend should return the new card.
      if (res) {
        setToast({ message: "Card added. Refreshing...", type: "success" });
        // Option 1: If your parent has a reload function, call it here.
        // Option 2: Manually add a placeholder if backend returns nothing:
        const newCard = { 
            id: Date.now(), // Temporary ID until refresh
            card_number: form.card_number, 
            is_favorite: 0 
        };
        setData(prev => ({ ...prev, cards: [...prev.cards, newCard] }));
      }
      
      setForm({ card_number: "", security_code: "", expiration_date: "" });
    } catch (err) {
      setToast({ message: err?.response?.data?.error || "Error adding card", type: "error" });
    }
  };

  return (
    <div className="panel">
      <h2>Payment Methods</h2>
      <div className="item-list">
        {cards.length === 0 ? (
          <p className="empty-message">No cards saved yet.</p>
        ) : (
          cards.map((card) => {
            // CRITICAL FIX: Guard against undefined/null cards in the array
            if (!card) return null;

            return (
              <div key={card.id} className="item">
                <div className="item-info">
                  <FontAwesomeIcon
                    // Optional chaining ?. is the final layer of safety
                    icon={card?.is_favorite ? solidStar : regularStar}
                    className={`favorite-icon ${card?.is_favorite ? "active" : ""}`}
                    onClick={() => handleFavorite(card.id)}
                  />
                  <span>Card ending in {card.card_number?.slice(-4) || "####"}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(card.id)}>
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="form">
        <h3>Add New Card</h3>
        <input
          placeholder="Card Number (16 digits)"
          value={form.card_number}
          onChange={input => setForm({ ...form, card_number: input.target.value.replace(/\D/g, "") })}
          maxLength="16"
        />
        <input
          placeholder="CVV"
          value={form.security_code}
          onChange={input => setForm({ ...form, security_code: input.target.value.replace(/\D/g, "") })}
          maxLength="4"
        />
        <input
          type="date"
          value={form.expiration_date}
          onChange={input => setForm({ ...form, expiration_date: input.target.value })}
        />
        <button className="submit-btn" type="submit">Add Card</button>
      </form>
    </div>
  );
};