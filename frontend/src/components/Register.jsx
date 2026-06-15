import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const isValidEmail = (email) => {
  const basicCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!basicCheck) return false;

  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "live.com",
    "protonmail.com",
    "aol.com",
    "gmx.com",
    "yandex.com",
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  return allowedDomains.includes(domain);
};

const isValidCPF = (cpf) => {
  if (!cpf) return false;
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;

  const digits = cleaned.split("").map(Number);

  const calc = (slice) => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += slice[i] * (slice.length + 1 - i);
    }
    const res = (sum * 10) % 11;
    return res === 10 ? 0 : res;
  };

  return (
    digits[9] === calc(digits.slice(0, 9)) &&
    digits[10] === calc(digits.slice(0, 10))
  );
};

const Register = ({ setToast }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim())
      return setToast({ message: "Name is required.", type: "error" });

    if (!isValidEmail(form.email))
      return setToast({ message: "Invalid email.", type: "error" });

    if (form.password.length < 6)
      return setToast({ message: "Password too short.", type: "error" });

    if (!isValidCPF(form.cpf))
      return setToast({ message: "Invalid CPF.", type: "error" });

    try {
      const payload = {
        ...form,
        cpf: form.cpf.replace(/\D/g, ""),
      };

      const response = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Register failed");

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setToast({ message: "Registered successfully!", type: "success" });

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Register</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <input name="cpf" placeholder="CPF" onChange={handleChange} />

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;