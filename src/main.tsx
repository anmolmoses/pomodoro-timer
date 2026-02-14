import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/glass.css';
import './index.css';
import { registerServiceWorker } from './services/registerSW';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register service worker for PWA offline support
registerServiceWorker();
