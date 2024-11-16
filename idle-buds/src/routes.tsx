import { ReactNode } from 'react';
import { ROUTES } from './constants/routeMappings';

import WoodcuttingPage from './activities/WoodcuttingActivity';
import CraftingPage from './activities/CraftingActivity';

export interface RouteConfig {
  path: string
  component: ReactNode
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: <WoodcuttingPage />
  },
  {
    path: ROUTES.WOODCUTTING,
    component: <WoodcuttingPage />
  },
  {
    path: ROUTES.CRAFTING,
    component: <CraftingPage />
  }
]