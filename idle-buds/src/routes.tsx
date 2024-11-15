import { ReactNode } from 'react';
import { ROUTES } from './constants/routeMappings';

import WoodcuttingPage from './pages/WoodcuttingPage';
import CraftingPage from './pages/CraftingPage';

export interface RouteConfig {
  path: string
  component: ReactNode
}

export const routes: RouteConfig[] = [
  {
    path: ROUTES.WOODCUTTING,
    component: <WoodcuttingPage />
  },
  {
    path: ROUTES.CRAFTING,
    component: <CraftingPage />
  }
]