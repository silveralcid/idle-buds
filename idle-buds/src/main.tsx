import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { useAutoSave } from './hooks/useAutoSave';

const AppWithAutoSave = () => {
  useAutoSave(); // Call the hook inside a component

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithAutoSave />);