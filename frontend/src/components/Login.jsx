import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/auth";

const Login = ({ setToast }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (input) => {
    setForm({ ...form, [input.target.name]: input.target.value });
  };

  const handleSubmit = async (input) => {
  input.preventDefault();

  if (!form.identifier)
    return setToast({ message: "Email or username is required.", type: "error" });

  if (!form.password)
    return setToast({ message: "Password is required.", type: "error" });

  try {
    const data = await authApi.login({
      identifier: form.identifier,
      password: form.password,
    });

    localStorage.setItem("token", data.token);

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    setToast({ message: "Login successful!", type: "success" });
    setTimeout(() => navigate("/dashboard"), 1000);
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  }
};

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Login</h2>

      <input
        type="text"
        name="identifier"
        placeholder="Email or Name"
        value={form.identifier}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
