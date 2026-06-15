import React, { useEffect, useState } from "react";
import image from "../assets/ToastImage.jpg";
import "./style/Toast.css";

const Toast = ({ message, type = "error", duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    const closeTimer = setTimeout(() => {
      onClose?.();
    }, duration + 300);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className={`toast ${visible ? "show" : ""} ${type}`}>
      <img src={image} alt="" />
      <p>{message}</p>
    </div>
  );
};

export default Toast;