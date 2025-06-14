import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@css/index.css';
import Stress from './components/stress';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Stress />
  </StrictMode>
);
