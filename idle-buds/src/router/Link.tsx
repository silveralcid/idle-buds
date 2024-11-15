import { ReactNode } from 'react'
import { useRouterStore } from './RouterStore'

interface LinkProps {
  to: string
  children: ReactNode
  className?: string
}

export const Link = ({ to, children, className }: LinkProps) => {
  const navigate = useRouterStore((state) => state.navigate)

  return (
    <button 
      className={className} 
      onClick={() => navigate(to)}
    >
      {children}
    </button>
  )
}
