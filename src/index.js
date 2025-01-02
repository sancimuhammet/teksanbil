import React from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM yerine react-dom/client kullanılıyor
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // ReactDOM.render yerine createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
