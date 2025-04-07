import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const VideoListPage = () => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://127.0.0.1:8000/api/videos/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVideos(res.data);
        if (res.data.length > 0) {
          setActiveVideo(res.data[0]);
        }
      } catch (err) {
        console.error('Ошибка при загрузке видео:', err);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="background" style={{ padding: '2rem', position: 'relative' }}>
      {/* Кнопка "Загрузить видео" */}
      <button
        className="submit-btn"
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          backgroundColor: '#1a1a80',
          padding: '0.6rem 1.2rem',
          fontSize: '1rem',
          zIndex: 1,
        }}
        onClick={() => navigate('/upload')}
      >
        Загрузить видео
      </button>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem' }}>
        {/* Главное видео */}
        <div style={{ flex: 2 }}>
          {activeVideo ? (
            <div>
              <h2 style={{ color: '#fff', marginBottom: '1rem' }}>{activeVideo.title}</h2>
              <video
                key={activeVideo.id}
                width="100%"
                height="auto"
                controls
                style={{ borderRadius: '10px' }}
              >
                <source src={activeVideo.video_file} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
              <p style={{ color: '#ccc', marginTop: '1rem' }}>{activeVideo.description}</p>
            </div>
          ) : (
            <div style={{ color: '#fff' }}>Нет доступных видео</div>
          )}
        </div>

        {/* Список других видео */}
        {videos.length > 1 && (
          <div
            style={{
              flex: 1.5,
              backgroundColor: '#0d0d0d',
              padding: '1rem',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              color: '#fff',
              overflowY: 'auto',
              maxHeight: '80vh',
            }}
          >
            <h3 style={{ margin: 0, color: '#fff' }}>Другие видео</h3>

            {videos
              .filter((v) => v.id !== activeVideo?.id)
              .map((video) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  style={{
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    backgroundColor: '#1c1c1c',
                    transition: 'background 0.3s',
                  }}
                >
                  <p style={{ marginBottom: '0.25rem', fontWeight: 'bold' }}>{video.title}</p>
                  <div style={{ position: 'relative' }}>
                    <video
                      src={video.video_file}
                      style={{
                        width: '100%',
                        height: '80px',
                        borderRadius: '4px',
                        objectFit: 'cover',
                        backgroundColor: '#000',
                      }}
                      muted
                      preload="metadata"
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '6px',
                        fontSize: '0.8rem',
                        color: '#fff',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '2px 4px',
                        borderRadius: '3px',
                      }}
                    >
                      ▶️
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoListPage;
