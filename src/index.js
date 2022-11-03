// Essentials
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'jotai'

// Contexts
import { AuthProvider } from './contexts/Auth';
import { PanelProvider } from './contexts/Panel';

// Components
import App from './App';
import PANEL_ROOT from './components/panels/Panel_Root';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider>
      <Router>
        <AuthProvider>
          <PanelProvider>
            <PANEL_ROOT />
            <App />
          </PanelProvider>
        </AuthProvider>
      </Router>
    </Provider>
  </React.StrictMode>
);