import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import {CryptoProvider} from "./context/CryptoContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <CryptoProvider>
          <App />
      </CryptoProvider>
  </React.StrictMode>
);

