import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthContextProvider } from './components/UserContext';
import { OwnerProvider } from './components/OwnerContext';
import { App } from './components/App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <OwnerProvider>
        <App />
      </OwnerProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
export default App;
