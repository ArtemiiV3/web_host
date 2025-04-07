import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert('Выберите видеофайл для загрузки');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video_file', videoFile); // <-- правильное имя

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('Вы не авторизованы');
        return;
      }

      const response = await axios.post('http://127.0.0.1:8000/api/videos/', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // <-- исправлено
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Ответ сервера:', response.data);
      alert('Видео успешно загружено!');
      navigate('/videos');
    } catch (error) {
      console.error('Ошибка при загрузке видео:', error);
      if (error.response?.data) {
        console.error('Ответ сервера:', error.response.data);
        alert(`Ошибка: ${JSON.stringify(error.response.data)}`); // <-- исправлено
      } else {
        alert('Не удалось загрузить видео. Проверьте подключение или формат файла.');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    setFileName(file ? file.name : '');
  };

  return (
    <div className="background">
      <div className="container">
        <h2 style={{ textAlign: 'center', color: '#1a1a80' }}>Загрузить видео</h2>
        <form className="form" onSubmit={handleUpload}>
          <label>Название</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название"
            required
          />

          <label>Описание</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание"
            required
          />

          <label className="submit-btn" style={{ background: '#4b5cff', marginTop: '1.5rem', textAlign: 'center' }}>
            Выберите файл
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>

          {fileName && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#333', textAlign: 'center' }}>
              Файл: {fileName}
            </div>
          )}

          <button className="submit-btn" type="submit">
            Загрузить
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
