import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './style/ErrorPage.css'

const ErrorPage = () => {
  const { statusCode } = useParams();
  const navigate = useNavigate();
  const code = statusCode || 404;
  const waiter = 5000

  const [countdown, setCountdown] = useState(waiter / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/");
    }, waiter);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="error">
      <h1>Error {code}</h1>
      <img
        src={`https://http.cat/${code}`}
        alt={`Error ${code}`}
      />
      <p>Oops! Something went wrong.</p>
      <p>Redirecting to home in {countdown}...</p>
    </div>
  );
};

export default ErrorPage;