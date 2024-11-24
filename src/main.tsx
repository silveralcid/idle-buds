import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const AppWithStrictMode = () => {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithStrictMode />);
