import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAutoSave } from './hooks/useAutoSave'; // Import the auto-save hook

const AppWithAutoSave = () => {
  // Use the auto-save hook
  useAutoSave();

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithAutoSave />);