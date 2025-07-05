import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkReduxDevToolsStatus } from './utils/reduxDevToolsHelper';

// Check Redux DevTools status in development mode
if (import.meta.env.DEV) {
  checkReduxDevToolsStatus();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
