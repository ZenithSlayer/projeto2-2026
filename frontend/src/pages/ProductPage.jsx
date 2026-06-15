import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { productsApi } from "../services/products";
import ItemRow from "../components/ItemRow";
import placeHolder from '../assets/placeHolder.png';
import "./style/ProductPage.css";

const ProductPage = ({ onAddToCart, setToast }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();

  useEffect(() => {
    setQuantity(1);
  }, [location]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productsApi.getById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-center">
        <div className="loader">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-center">
        <h2 className="error">{error}</h2>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="product-page">
        <div className="product-card">
          <img src={product.image_url || placeHolder} alt={product.name} />

          <div className="product-info">
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <h2 className="price">${Number(product.price).toFixed(2)}</h2>

            <div className="quantity">
              <button
                onClick={() =>
                  setQuantity((quantity) => Math.max(1, quantity - 1))
                }
              >
                -
              </button>

              <span>{quantity}</span>

              <button onClick={() => setQuantity((quantity) => quantity + 1)}>
                +
              </button>
            </div>

            <button
              className="add-btn"
              onClick={() => {
                onAddToCart(product, quantity);
                setToast({
                  message: `${quantity}x ${product.name} added to cart`,
                  type: "success",
                });
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="categories">
        {product.categories && (
          <div className="tags-container">
            <h3>Categories</h3>

            <div className="tags">
              {JSON.parse(product.categories).map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <ItemRow offset={0} />
    </div>
  );
};

export default ProductPage;
