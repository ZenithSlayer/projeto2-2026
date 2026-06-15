import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import Img from "../assets/register.png";
import "./style/AuthPage.css";

const AuthPage = ({ setToast }) => {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth-container">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="selector">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <div className="auth">
          <img src={Img} alt="auth" />
          {mode === "login"
            ? <Login setToast={setToast} />
            : <Register setToast={setToast} />
          }
        </div>
      </div>
    </div>
  );
};

export default AuthPage;