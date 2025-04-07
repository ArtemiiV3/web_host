import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Общий стиль

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#1a1a80', marginBottom: '2rem' }}>Добро пожаловать на видеоплатформу</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            className="submit-btn"
            style={{ backgroundColor: '#4b5cff' }}
            onClick={() => navigate('/login')}
          >
            Войти
          </button>

          <button
            className="submit-btn"
            style={{ backgroundColor: '#1a1a80' }}
            onClick={() => navigate('/register')}
          >
            Регистрация
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
