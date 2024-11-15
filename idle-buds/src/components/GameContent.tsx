// src/components/GameContent.tsx
import { useRouterStore } from '../router/RouterStore';
import WoodcuttingActivityPage from "../pages/WoodcuttingPage";
import CraftingActivityPage from "../pages/CraftingPage";
import DummyPage from "./DummyPage";
import { ROUTES } from '../constants/routeMappings';

export const GameContent = () => {
  const currentRoute = useRouterStore((state) => state.currentRoute);

  console.log('GameContent rendering, current route:', currentRoute);

  // Route mapping function
  const getRouteComponent = (path: string) => {
    switch (path) {
      // Default route
      case ROUTES.HOME:
        return <CraftingActivityPage />;

      // Main sections
      case ROUTES.STORE:
        return <DummyPage title="Store" />;
      case ROUTES.INVENTORY:
        return <DummyPage title="Inventory" />;
      case ROUTES.BUD_BOX:
        return <DummyPage title="Bud Box" />;

      // Combat routes
      case ROUTES.LEVEL:
        return <DummyPage title="Level" />;
      case ROUTES.ATTACK:
        return <DummyPage title="Attack" />;
      case ROUTES.DEFENSE:
        return <DummyPage title="Defense" />;
      case ROUTES.HEALTH:
        return <DummyPage title="Health" />;
      case ROUTES.EFFICIENCY:
        return <DummyPage title="Efficiency" />;

      // Passive routes
      case ROUTES.FARMING:
        return <DummyPage title="Farming" />;

      // Non-Combat routes
      case ROUTES.WOODCUTTING:
        return <WoodcuttingActivityPage />;
      case ROUTES.FISHING:
        return <DummyPage title="Fishing" />;
      case ROUTES.COOKING:
        return <DummyPage title="Cooking" />;
      case ROUTES.MINING:
        return <DummyPage title="Mining" />;
      case ROUTES.SMITHING:
        return <DummyPage title="Smithing" />;
      case ROUTES.CRAFTING:
        return <CraftingActivityPage />;

      // Other routes
      case ROUTES.COMPLETION_LOG:
        return <DummyPage title="Completion Log" />;
      case ROUTES.LORE:
        return <DummyPage title="Lore" />;
      case ROUTES.STATISTICS:
        return <DummyPage title="Statistics" />;
      case ROUTES.SETTINGS:
        return <DummyPage title="Settings" />;
      case ROUTES.NEWS:
        return <DummyPage title="News & Changelog" />;

      // Support routes
      case ROUTES.BUG_REPORT:
        return <DummyPage title="Report a Bug" />;
      case ROUTES.PRIVACY:
        return <DummyPage title="Privacy Policy" />;

      // 404 route
      default:
        return <DummyPage title="Page Not Found" />;
    }
  };

  return (
    <div className="pt-12">
      {getRouteComponent(currentRoute)}
    </div>
  );
};
