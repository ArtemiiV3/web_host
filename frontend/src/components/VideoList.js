import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Register.css';

const VideoListPage = () => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/videos/');
      const updatedVideos = res.data.map(video => ({
        ...video,
        video_url: video.video_url.startsWith('http') 
          ? video.video_url 
          : `http://127.0.0.1:8000${video.video_url}`
      }));
      setVideos(updatedVideos);
      if (updatedVideos.length > 0 && !activeVideo) {
        setActiveVideo(updatedVideos[0]);
      }
    } catch (err) {
      console.error('Ошибка при загрузке видео:', err);
      alert('Ошибка при загрузке видео');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchVideos();
    }
  }, [location.state]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="background">
      <button
        className="submit-btn"
        onClick={() => navigate('/upload')}
      >
        Загрузить видео
      </button>

      <div className="video-page-container">
        <div className="main-video">
          {activeVideo ? (
            <div>
              <h2>{activeVideo.title}</h2>
              <video
                key={activeVideo.id}
                controls
                onError={(e) => console.error('Ошибка воспроизведения видео:', e)}
              >
                <source src={activeVideo.video_url} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
              <p>{activeVideo.description || 'Нет описания'}</p>
            </div>
          ) : (
            <div>Нет доступных видео</div>
          )}
        </div>

        {videos.length > 1 && (
          <div className="other-videos">
            <h3>Другие видео</h3>
            {videos
              .filter((v) => v.id !== activeVideo?.id)
              .map((video) => (
                <div
                  key={video.id}
                  className="video-item"
                  onClick={() => setActiveVideo(video)}
                >
                  <p>{video.title}</p>
                  <div style={{ position: 'relative' }}>
                    <video
                      src={video.video_url}
                      muted
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        const duration = e.target.duration;
                        e.target.nextSibling.textContent = formatDuration(duration);
                      }}
                    />
                    <span className="duration">0:00</span>
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