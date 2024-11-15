import { create } from 'zustand'

export type Route = {
  path: string
  params?: Record<string, string>
}

interface RouterState {
  currentRoute: Route
  history: Route[]
  navigate: (path: string, params?: Record<string, string>) => void
  goBack: () => void
}

export const useRouterStore = create<RouterState>((set) => ({
  currentRoute: { path: '/' },
  history: [],
  
  navigate: (path, params = {}) => 
    set((state) => ({
      currentRoute: { path, params },
      history: [...state.history, state.currentRoute]
    })),
    
  goBack: () => 
    set((state) => ({
      currentRoute: state.history[state.history.length - 1] || { path: '/' },
      history: state.history.slice(0, -1)
    }))
}))
