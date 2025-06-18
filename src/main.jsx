import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@pages/App';
import Rank from '@pages/rank/Rank';
import Irir from '@pages/irir/Irir';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
