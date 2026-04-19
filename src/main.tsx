import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg, #1e293b)',
              color: 'var(--toast-color, #f1f5f9)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            },
            success: { iconTheme: { primary: '#198f51', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
