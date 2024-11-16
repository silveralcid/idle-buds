import { ReactNode } from 'react'
import { useRouterStore } from './RouterStore'
import DummyPage from '../components/DummyPage'

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
    return <DummyPage title="404" />
  }

  return <>{currentComponent}</>
}
