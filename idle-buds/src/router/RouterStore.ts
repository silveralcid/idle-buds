import { create } from 'zustand'

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
  "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee",
  "winter", "dim", "nord", "sunset"
] as const

export type Theme = typeof THEMES[number]

interface RouterState {
  currentRoute: string
  currentTheme: Theme
  navigate: (path: string) => void
  setTheme: (theme: Theme) => void
}

export const useRouterStore = create<RouterState>((set) => ({
  currentRoute: '/',
  currentTheme: (localStorage.getItem('theme') as Theme) || 'fantasy',
  
  navigate: (path) => set({ currentRoute: path }),
  
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    set({ currentTheme: theme })
  }
}))
