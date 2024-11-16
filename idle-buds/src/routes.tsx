import { ReactNode } from 'react';
import { ROUTES } from './data/constants/routeMappings';

import WoodcuttingPage from './views/WoodcuttingView';
import CraftingPage from './views/CraftingView';
import { Testing } from './views/TestingView';

export interface RouteConfig {
  path: string
  component: ReactNode
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: <Testing />
  },
  {
    path: ROUTES.WOODCUTTING,
    component: <WoodcuttingPage />
  },
  {
    path: ROUTES.CRAFTING,
    component: <CraftingPage />
  },
  {
    path: ROUTES.TESTING,
    component: <Testing />
  }
]