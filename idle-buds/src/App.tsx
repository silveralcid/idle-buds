import { useState } from 'react'
import './App.css'

import { DrawerLayout } from './components/Layout/Drawer'
import { Sidebar } from './components/Sidebar'
import { GameContent } from './components/GameContent'

function App() {
  const [] = useState(0)

  return (
    <>
      <DrawerLayout 
      sideContent={<Sidebar />}
    >
      <GameContent />
    </DrawerLayout>
    </>
  )
}

export default App
