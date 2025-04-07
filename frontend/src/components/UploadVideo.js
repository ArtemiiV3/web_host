import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  // Функция для обновления токена
  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
        refresh: refresh,
      });

      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      return newAccessToken;
    } catch (error) {
      console.error('Ошибка обновления токена:', error.response ? error.response.data : error.message);
      // Если refresh-токен недействителен, перенаправляем на страницу входа
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
      throw error;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !videoFile) {
      alert('Пожалуйста, заполните заголовок и выберите видео.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', videoFile);

    let response; // Объявляем response здесь, чтобы она была доступна в обоих try-блоках

    try {
      response = await axios.post('http://127.0.0.1:8000/api/video/upload/', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Видео успешно загружено!');
      navigate('/videos');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          await refreshToken();
          // Повторяем запрос с новым токеном
          response = await axios.post('http://127.0.0.1:8000/api/video/upload/', formData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          alert('Видео успешно загружено!');
          navigate('/videos');
        } catch (refreshError) {
          alert('Сессия истекла. Пожалуйста, войдите снова.');
        }
      } else {
        console.error('Ошибка загрузки:', error.response ? error.response.data : error.message);
        alert('Ошибка загрузки видео: ' + (error.response ? error.response.data.error : 'Неизвестная ошибка'));
      }
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h2 className="tab-title">Загрузка видео</h2>
        <div className="form">
          <h2 className="form-title">Данные для видео</h2>

          <label>Заголовок *</label>
          <input
            type="text"
            name="title"
            placeholder="Введите заголовок видео"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Видео файл *</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
            required
          />

          <button className="submit-btn" onClick={handleUpload}>
            Загрузить видео
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;