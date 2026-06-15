import React, { useState, useEffect } from "react";
import ItemRow from "../components/ItemRow.jsx";
import { productsApi } from "../services/products";
import "./style/StorePage.css";

const StorePage = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerRow = 4;
  const rowsPerPage = 4;
  const itemsPerPage = itemsPerRow * rowsPerPage;

  useEffect(() => {
    const fetchAll = async () => {
      let data = []
      try {
          if (categoryId) {
            data = await productsApi.getAllCategory(categoryId);
            setCurrentPage(0)
          }
          else {
            data = await productsApi.getAll();
          }
        setProducts(data);
      } catch (err) {
        console.error("Store Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [categoryId]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentView = products.slice(startIndex, startIndex + itemsPerPage);

  const rows = [];
  for (let i = 0; i < currentView.length; i += itemsPerRow) {
    rows.push(currentView.slice(i, i + itemsPerRow));
  }

  if (loading) return <div className="loader">Loading your store...</div>;

  return (
    <div className="store-container">

      <div className="product-grid-vertical">
        {rows.map((rowItems, index) => (
          <ItemRow key={`${currentPage}-${index}`} products={rowItems} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            disabled={currentPage === 0}
            onClick={() => {
              setCurrentPage((p) => p - 1);
              window.scrollTo(0, 0);
            }}
          >
            &larr; Previous
          </button>

          <span className="page-indicator">
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => {
              setCurrentPage((p) => p + 1);
              window.scrollTo(0, 0);
            }}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default StorePage;
