import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
<<<<<<< HEAD
import Rain from "./components/a";
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Rain/>
=======
import { BrowserRouter, Routes, Route } from 'react-router';

import App from '@pages/App';
import Rank from '@pages/rank/Rank';
import Irir from '@pages/irir/Irir';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="/irir" element={<Irir />} />
      </Routes>
    </BrowserRouter>
>>>>>>> 8e5f18219f5b17fa50fd87ac2969badff8c3e922
  </StrictMode>
);
