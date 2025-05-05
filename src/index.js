import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';

// Permettre la communication avec Home Assistant
window.addEventListener('message', event => {
  // Vérifier l'origine du message (à ajuster selon votre configuration)
  if (event.data && event.data.type) {
    // Gérer les différents types de messages
    switch (event.data.type) {
      case 'reload':
        window.location.reload();
        break;
      case 'navigate':
        if (event.data.path) {
          window.location.href = event.data.path;
        }
        break;
      default:
        break;
    }
  }
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
