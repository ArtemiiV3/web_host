// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', form);
      alert('Регистрация успешна!');
      navigate('/login');
    } catch (error) {
      console.error('Ошибка регистрации:', error.response ? error.response.data : error.message);
      alert('Ошибка регистрации.');
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h2 className="tab-title">Регистрация</h2>
        <form className="form" onSubmit={handleRegister}>
          <h2 className="form-title">Данные для авторизации</h2>

          <label>Имя пользователя *</label>
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Email *</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Пароль *</label>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Повторите пароль *</label>
          <input
            type="password"
            name="password2"
            placeholder="Повторите пароль"
            value={form.password2}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn">Зарегистрироваться</button>

          <p className="note">* поле, обязательное для заполнения</p>
        </form>
      </div>
    </div>
  );
};

export default Register;
