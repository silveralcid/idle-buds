import { useState } from 'react'
import './App.css'

import { DrawerLayout } from './components/Layout/Drawer'
import { Sidebar } from './components/Sidebar'
import { GameContent } from './components/GameContent'
import { Navbar } from './components/Navbar/Navbar'

function App() {
  const [] = useState(0)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <DrawerLayout 
          sideContent={<Sidebar />}
        >
          <GameContent />
        </DrawerLayout>
      </div>
    </div>
  )
}

export default App
