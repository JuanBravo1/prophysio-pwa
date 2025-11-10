import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 🧩 Importa el Service Worker
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// 📊 Métricas opcionales
reportWebVitals();

// 🚀 Registrar el Service Worker para habilitar la PWA
serviceWorkerRegistration.register();
