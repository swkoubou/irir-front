import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Rain from "./components/a";
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Rain/>
  </StrictMode>
);
