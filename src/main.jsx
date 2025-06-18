import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@css/index.css';
import SecondResult from './components/SecondResult';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SecondResult />
  </StrictMode>
);
