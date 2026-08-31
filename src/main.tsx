import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './styles/index.css';
import './styles/App.css';
import './styles/granada.css';

// Identificador de cliente de Google OAuth. Se define en .env.local:
//   VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
// Sin el, la aplicacion funciona igual salvo el boton de entrar.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Copia local para el sotano del laboratorio, donde no hay cobertura. Solo en
// produccion: en desarrollo un service worker sirviendo modulos cacheados
// convierte cualquier cambio en un misterio.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .catch(() => undefined);
  });
}
