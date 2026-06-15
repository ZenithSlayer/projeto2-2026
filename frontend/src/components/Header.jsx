import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./style/Header.css";
import logo from "../assets/logo.png";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button onClick={toggleSidebar} className="menu-button">
        <FontAwesomeIcon icon={faBars} />
      </button>

      <img className="logo" src={logo} alt="Logo" />
    </header>
  );
};

export default Header;