import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import VideoList from './components/VideoList';
import UploadVideo from './components/UploadVideo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/videos" element={<VideoList />} />
        <Route path="/upload" element={<UploadVideo />} />
      </Routes>
    </Router>
  );
}

export default App;