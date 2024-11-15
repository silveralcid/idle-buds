import { BrowserRouter } from 'react-router-dom'
import './App.css'

import { DrawerLayout } from './components/Layout/Drawer'
import { Sidebar } from './components/Sidebar'
import { GameContent } from './components/GameContent'

function App() {
  return (
    <BrowserRouter>
      <DrawerLayout sideContent={<Sidebar />}>
        <GameContent />
      </DrawerLayout>
    </BrowserRouter>
  )
}

export default App