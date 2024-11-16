import { DrawerLayout } from './components/Layout/Drawer'
import { Router } from './router/Router'
import { routes } from './routes'
import { Sidebar } from './components/Sidebar'
import { useRouterStore } from './router/RouterStore'
import { useGameStore } from './stores/useStore'
import { useEffect, useState } from 'react'
import type { Theme } from './router/RouterStore' 
import { initializeAutoSave } from './utils/autoSave'
import { updateLastActiveTime, calculateOfflineProgress, applyOfflineProgress } from './utils/offlineProgress'
import { OfflineProgressModal } from './components/OfflineProgressModal'

function App() {
  const setTheme = useRouterStore((state) => state.setTheme)
  const setCurrentActivity = useGameStore(state => state.setCurrentActivity)
  const [offlineProgress, setOfflineProgress] = useState<any>(null)
  
  // Theme initialization effect
  useEffect(() => {
    // Initialize auto-save system
    initializeAutoSave()

    // Handle theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme as Theme)
    }
  }, [setTheme])

  // Offline progress effect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const progress = calculateOfflineProgress()
        if (progress) {
          setOfflineProgress(progress)
        }
      }
      updateLastActiveTime()
    }

    const handleFocus = () => {
      updateLastActiveTime()
    }

    // Check for offline progress on initial load
    const initialProgress = calculateOfflineProgress()
    if (initialProgress) {
      setOfflineProgress(initialProgress)
    }

    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleClaimOfflineProgress = () => {
    if (offlineProgress) {
      applyOfflineProgress(offlineProgress)
      setOfflineProgress(null)
    }
  }

  return (
    <DrawerLayout sideContent={<Sidebar />}>
      <Router routes={routes} />
      {offlineProgress && (
        <OfflineProgressModal
          offlineTime={offlineProgress.offlineTime}
          progress={offlineProgress.progress}
          onClose={handleClaimOfflineProgress}
        />
      )}
    </DrawerLayout>
  )
}

export default App