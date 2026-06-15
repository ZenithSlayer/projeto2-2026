import React from "react";
import StorePage from './StorePage'
import Art from"../assets/wideArt.jpg"
import "./style/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to 214K!</h1>
      <img className="home-decoration" src={Art} alt="" />
      <StorePage />
    </div>
  );
};

export default Home;