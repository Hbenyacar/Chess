import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Lobby from './Lobby';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
    </Routes>
  );
}

export default App;
