import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', form);
      // Сохраняем токены в localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // Устанавливаем заголовок Authorization для последующих запросов
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      alert('Регистрация успешна! Вы автоматически вошли в систему.');
      // Перенаправляем на страницу с видео
      navigate('/videos');
    } catch (error) {
      console.error('Ошибка регистрации:', error.response ? error.response.data : error.message);
      alert('Ошибка регистрации. Проверьте данные и попробуйте снова.');
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h2 className="tab-title">Регистрация</h2>
        <div className="form">
          <h2 className="form-title">Данные для регистрации</h2>

          <label>Имя пользователя *</label>
          <input
            type="text"
            name="username"
            placeholder="Введите имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Введите email"
            value={form.email}
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

          <button className="submit-btn" onClick={handleRegister}>
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;