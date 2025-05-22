import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { ChartVisibilityProvider } from './context/ChartVisibilityContext'; // ✅ ADD THIS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChartVisibilityProvider> {/* ✅ WRAP HERE */}
        <App />
      </ChartVisibilityProvider>
    </BrowserRouter>
  </React.StrictMode>
);
