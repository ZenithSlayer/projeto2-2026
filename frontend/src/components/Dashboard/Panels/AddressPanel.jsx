import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { addressesApi } from "../../../services/addresses.ts";

export const AddressPanel = ({ data, setData, setToast }) => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    country: "",
    state: "",
    city: "",
    street: "",
    number: "",
    postal_code: ""
  });

  const addresses = data?.addresses || [];

  const resetForm = () => {
    setForm({ country: "", state: "", city: "", street: "", number: "", postal_code: "" });
    setEditingId(null);
  };

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (addr) => {
    if (!addr) return;
    setEditingId(addr.id);
    setForm({
      country: addr.country || "",
      state: addr.state || "",
      city: addr.city || "",
      street: addr.street || "",
      number: addr.number || "",
      postal_code: addr.postal_code || ""
    });
  };

  const handleFavorite = async (id) => {
    try {
      await addressesApi.setFavorite(id);
      setData(prev => ({
        ...prev,
        addresses: prev.addresses.map(a => 
          a ? { ...a, is_favorite: a.id === id ? 1 : 0 } : a
        )
      }));
      setToast({ message: "Favorite address updated", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to update favorite", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await addressesApi.delete(id);
      setData(prev => ({
        ...prev,
        addresses: prev.addresses.filter(a => a && a.id !== id)
      }));
      setToast({ message: "Address deleted", type: "success" });
    } catch (err) {
      setToast({ message: "Error deleting address", type: "error" });
    }
  };

  const handleSubmit = async (input) => {
    input.preventDefault();
    
    const allFieldsFilled = Object.values(form).every(value => 
      value && value.toString().trim() !== ""
    );
    
    if (!allFieldsFilled) {
      return setToast({ message: "All fields are required.", type: "error" });
    }

    try {
      if (editingId) {
        await addressesApi.update(editingId, form);
        setData(prev => ({
          ...prev,
          addresses: prev.addresses.map(a => 
            a?.id === editingId ? { ...a, ...form } : a
          )
        }));
        setToast({ message: "Address updated successfully", type: "success" });
      } else {
        const res = await addressesApi.create(form);
        const newAddress = res.address || { ...form, id: Date.now(), is_favorite: 0 };
        setData(prev => ({
          ...prev,
          addresses: [...prev.addresses, newAddress]
        }));
        setToast({ message: "New address added successfully", type: "success" });
      }
      resetForm();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Operation failed";
      setToast({ message: errorMsg, type: "error" });
    }
  };

  return (
    <div className="panel">
      <h2>Your Addresses</h2>
      <div className="item-list">
        {addresses.length === 0 ? (
          <p className="empty-message">No addresses saved yet.</p>
        ) : (
          addresses.map(addr => {
            if (!addr) return null;

            return (
              <div key={addr.id} className="item">
                <div className="item-info">
                  <FontAwesomeIcon 
                    icon={addr?.is_favorite ? solidStar : regularStar} 
                    className={`favorite-icon ${addr?.is_favorite ? "active" : ""}`}
                    onClick={() => handleFavorite(addr.id)} 
                  />
                  <div className="address-details">
                    <strong>{addr.street || "Unknown Street"}, {addr.number || "N/A"}</strong>
                    <span>{addr.city}, {addr.state}, {addr.country}</span>
                    <small>{addr.postal_code}</small>
                  </div>
                </div>
                <div className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(addr)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(addr.id)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <hr />
      <form onSubmit={handleSubmit} className="form">
        <h3>{editingId ? "Edit Address" : "Add New Address"}</h3>
        <div className="form-grid">
          <input 
            placeholder="Country" 
            value={form.country} 
            onChange={input => handleFieldChange("country", input.target.value)} 
          />
          <input 
            placeholder="State" 
            value={form.state} 
            onChange={input => handleFieldChange("state", input.target.value)} 
          />
          <input 
            placeholder="City" 
            value={form.city} 
            onChange={input => handleFieldChange("city", input.target.value)} 
          />
          <input 
            placeholder="Street" 
            value={form.street} 
            onChange={input => handleFieldChange("street", input.target.value)} 
          />
          <input 
            placeholder="Number" 
            value={form.number} 
            onChange={input => handleFieldChange("number", input.target.value.replace(/\D/g, ""))} 
          />
          <input 
            placeholder="Postal Code" 
            value={form.postal_code} 
            onChange={input => handleFieldChange("postal_code", input.target.value)} 
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingId ? "Update Address" : "Add Address"}
          </button>
          {editingId && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};