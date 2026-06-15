import React, { useState, useEffect } from "react";
import { productsApi } from "../services/products";
import StorePage from "./StorePage"; 
import "./style/SearchPage.css";

const Search = () => {
  const [tags, setTags] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // 1. Get the tags once to build the button menu
  useEffect(() => {
    const getTags = async () => {
      try {
        const data = await productsApi.getAllTags();
        setTags(data);
      } catch (err) {
        console.error("Failed to load tags:", err);
      }
    };
    getTags();
  }, []);

  return (
    <div className="search-container">
      <div className="tag-search">
        <button 
          className={selectedCategoryId === null ? "active" : ""} 
          onClick={() => setSelectedCategoryId(null)}
        >
          All Products
        </button>

        {tags.map((tag) => (
          <button
            key={tag.id}
            className={selectedCategoryId === tag.id ? "active" : ""}
            onClick={() => setSelectedCategoryId(tag.id)}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {/* 3. The StorePage handles all the fetching logic based on the ID */}
      <div className="search-results">
        <StorePage categoryId={selectedCategoryId} />
      </div>
    </div>
  );
};

export default Search;