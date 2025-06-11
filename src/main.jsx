import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import App from '@pages/App';
import Play from '@pages/play/Play';
import Rank from '@pages/rank/Rank';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/play" element={<Play />} />
        <Route path="/rank" element={<Rank />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
