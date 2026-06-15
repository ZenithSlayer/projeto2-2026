import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMagnifyingGlass,
  faShoppingCart,
  faTachometerAlt,
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./style/Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const menu = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Search", path: "/search", icon: faMagnifyingGlass },
    ...(isLoggedIn
      ? [{ name: "Cart", path: "/cart", icon: faShoppingCart }]
      : []),
    ...(isLoggedIn
      ? [{ name: "Dashboard", path: "/dashboard", icon: faTachometerAlt }]
      : []),
  ];

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth");
    } else {
      navigate("/auth");
    }
  };

  return (
    <aside className="sidebar" style={{ width: isOpen ? "220px" : "70px" }}>
      {menu.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`link ${isActive ? "active" : ""} ${isOpen ? "open" : "closed"
              }`}
          >
            <FontAwesomeIcon icon={item.icon} />
            {isOpen && <span>{item.name}</span>}
          </Link>
        );
      })}

      <button
        onClick={handleAuthClick}
        className={`link auth-logout-button ${isLoggedIn ? "logout" : "auth"} ${isOpen ? "open" : "closed"}`}
      >
        <FontAwesomeIcon
          icon={isLoggedIn ? faRightFromBracket : faRightToBracket}
        />
        {isOpen && <span>{isLoggedIn ? "Logout" : "Login"}</span>}
      </button>
    </aside>
  );
};

export default Sidebar;