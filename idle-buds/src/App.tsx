import { DrawerLayout } from './components/Layout/Drawer'
import { Router } from './router/Router'
import { routes } from './routes'
import { Sidebar } from './components/Sidebar'
import { useRouterStore } from './router/RouterStore'
import { useEffect } from 'react'
import type { Theme } from './router/RouterStore' 
import { GameContent } from './components/GameContent'

function App() {
  const setTheme = useRouterStore((state) => state.setTheme)
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme as Theme)
    }
  }, [setTheme])  // Add setTheme to dependency array

  return (
    <DrawerLayout sideContent={<Sidebar />}>
      <Router routes={routes} />
    </DrawerLayout>
  )
}

export default App
