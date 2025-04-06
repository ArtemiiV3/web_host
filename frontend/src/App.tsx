import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Video Hosting</h1>} />
      </Routes>
    </Router>
  );
}

export default App;