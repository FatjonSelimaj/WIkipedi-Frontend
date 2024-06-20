import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { NextUIProvider } from '@nextui-org/react';

// Trova l'elemento root
const container = document.getElementById('root');
if (container) {
  // Crea un root utilizzando createRoot
  const root = createRoot(container);

  // Renderizza l'app
  root.render(
    <React.StrictMode>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </React.StrictMode>
  );
} else {
  console.error('Elemento root non trovato');
}
