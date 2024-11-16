import { DrawerLayout } from './components/Layout/Drawer'
import { Router } from './router/Router'
import { routes } from './routes'
import { Sidebar } from './components/Sidebar'
import { useRouterStore } from './router/RouterStore'
import { useGameStore } from './stores/useStore' // Add this import
import { useEffect } from 'react'
import type { Theme } from './router/RouterStore' 

function App() {
  const setTheme = useRouterStore((state) => state.setTheme)
  const setCurrentActivity = useGameStore(state => state.setCurrentActivity)
  
  useEffect(() => {
    // Handle theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme as Theme)
    }

    // Set default activity
    setCurrentActivity('woodcutting')
  }, [setTheme, setCurrentActivity])

  return (
    <DrawerLayout sideContent={<Sidebar />}>
      <Router routes={routes} />
    </DrawerLayout>
  )
}

export default App
