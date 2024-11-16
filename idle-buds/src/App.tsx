import { DrawerLayout } from './components/Layout/Drawer'
import { Router } from './router/Router'
import { routes } from './routes'
import { Sidebar } from './components/Sidebar'
import { useRouterStore } from './router/RouterStore'
import { useGameStore } from './stores/useStore'
import { useEffect } from 'react'
import type { Theme } from './router/RouterStore' 
import { initializeAutoSave } from './utils/autoSave'

function App() {
  const setTheme = useRouterStore((state) => state.setTheme)
  const setCurrentActivity = useGameStore(state => state.setCurrentActivity)
  
  useEffect(() => {
    // Initialize auto-save system
    initializeAutoSave();

    // Handle theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme as Theme)
    }

    // Note: We don't need to set default activity here anymore
    // as it will be handled by the load game system
    // If no save exists, the initial state in the store will be used
  }, [setTheme, setCurrentActivity])
  return (
    <DrawerLayout sideContent={<Sidebar />}>
      <Router routes={routes} />
    </DrawerLayout>
  )
}

export default App
