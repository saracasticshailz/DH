import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './App.tsx';
import './default.css';
import './translations/index.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
