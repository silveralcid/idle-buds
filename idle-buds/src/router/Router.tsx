import { ReactNode } from 'react'
import { useRouterStore } from './RouterStore'

interface RouteConfig {
  path: string
  component: ReactNode
}

interface RouterProps {
  routes: RouteConfig[]
}

export const Router = ({ routes }: RouterProps) => {
  const currentPath = useRouterStore((state) => state.currentRoute)
  
  const currentComponent = routes.find(route => route.path === currentPath)?.component

  if (!currentComponent) {
    return <div>Page not found</div>
  }

  return <>{currentComponent}</>
}
