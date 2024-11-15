// src/routes.ts
export const ROUTES = {
    HOME: '/',
    // Main sections
    STORE: '/store',
    INVENTORY: '/inventory',
    BUD_BOX: '/bud-box',
    
    // Combat
    LEVEL: '/level',
    ATTACK: '/attack',
    DEFENSE: '/defense',
    HEALTH: '/health',
    EFFICIENCY: '/efficiency',
    
    // Passive
    FARMING: '/farming',
    
    // Non-Combat
    WOODCUTTING: '/woodcutting',
    FISHING: '/fishing',
    COOKING: '/cooking',
    MINING: '/mining',
    SMITHING: '/smithing',
    CRAFTING: '/crafting',
    
    // Other
    COMPLETION_LOG: '/completion-log',
    LORE: '/lore',
    STATISTICS: '/statistics',
    SETTINGS: '/settings',
    NEWS: '/news',
    
    // Support
    BUG_REPORT: '/bug-report',
    PRIVACY: '/privacy',
  } as const;
  
  export type RouteKeys = keyof typeof ROUTES;
  export type Routes = typeof ROUTES[RouteKeys];