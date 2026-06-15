import React, { useState } from "react";
import { api } from "../../../services/api";

export const ProductPanel = ({ data, setData, setToast }) => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category_name: "", image_url: "" });

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", category_name: "", image_url: "" });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({ ...product });
  };

  const handleSubmit = async (input) => {
    input.preventDefault();

    if (!form.name || !form.description || !form.price || !form.category_name) {
      setToast({ message: "Please fill in all required fields", type: "error" });
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentAdminId = storedUser?.id;

    if (!currentAdminId) {
      setToast({ message: "Session expired. Please log in again.", type: "error" });
      return;
    }

    const payload = { 
      ...form, 
      price: parseFloat(form.price),
      admin_id: currentAdminId
    };

    try {
      await api[editingId ? 'put' : 'post'](
        editingId ? `/products/${editingId}` : "/products",
        payload
      );
      
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Error saving product", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setData(prev => ({ ...prev, products: prev.products.filter(product => product.id !== id) }));
      setToast({ message: "Product removed", type: "success" });
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  return (
    <div className="panel">
      <h2>Inventory Management</h2>
      <form onSubmit={handleSubmit} className="form">
        <h3>{editingId ? "Edit Product" : "Create New Product"}</h3>
        <input placeholder="Product Name" value={form.name} onChange={input => setForm({ ...form, name: input.target.value })} />
        <input placeholder="Price" type="number" value={form.price} onChange={input => setForm({ ...form, price: input.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={input => setForm({ ...form, description: input.target.value })} />
        <input placeholder="Category" value={form.category_name} onChange={input => setForm({ ...form, category_name: input.target.value })} />
        <input placeholder="Image URL" value={form.image_url} onChange={input => setForm({ ...form, image_url: input.target.value })} />

        <div className="form-actions">
          <button className="submit-btn" type="submit">{editingId ? "Update Product" : "Add Product"}</button>
          {editingId && <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
      <div className="item-list">
        {data.products.map(product => (
          <div key={product.id} className="item">
            <div className="item-info">
              <strong>{product.name}</strong>
              <span>${product.price}</span>
            </div>
            <div className="actions">
              <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};