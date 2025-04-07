import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', form);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      alert('Успешный вход!');
      navigate('/videos');
    } catch (error) {
      console.error('Ошибка входа:', error.response ? error.response.data : error.message);
      alert('Ошибка входа. Проверьте имя пользователя и пароль.');
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h2 className="tab-title">Войти</h2>
        <div className="form">
          <h2 className="form-title">Данные для входа</h2>

          <label>Имя пользователя *</label>
          <input
            type="text"
            name="username"
            placeholder="Введите имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Пароль *</label>
          <input
            type="password"
            name="password"
            placeholder="Введите пароль"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="submit-btn" onClick={handleLogin}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;