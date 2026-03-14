import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const origin = window.location.origin;
console.warn(
  `[OAuth] Add this to Google Cloud Console > OAuth client > Authorized JavaScript origins: ${origin}`
);
console.warn(
  `[OAuth] Ensure this exact redirect URI is listed in Authorized redirect URIs: ${window.location.href}`
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
