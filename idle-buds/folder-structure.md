src/
├── assets/
├── components/
│ ├── common/
│ └── game/
├── data/
├── views/
├── stores/
├── types/
├── utils/
├── hooks/
├── constants/
├── routes/
├── game/
│ ├── loop/
│ └── mechanics/
├── App.tsx
└── main.tsx

# Project Structure

## `src/`

### `assets/`

- **Purpose**: Store static assets like images, icons, and other media files.
- **Examples**:
  - `images/`: Game-related images.
  - `icons/`: Icons used throughout the UI.

### `components/`

- **Purpose**: Contain reusable UI components.
- **Subdirectories**:
  - `common/`: Shared components like buttons, modals, and progress bars.
  - `game/`: Game-specific components like skill cards and resource displays.
- **Examples**:
  - `Button.tsx`: A reusable button component.
  - `SkillCard.tsx`: A component to display skill information.

### `data/`

- **Purpose**: Store static configuration data for creatures, items, resources, etc.
- **Examples**:
  - `items/`: Data files for weapons, resources, and equipment.
  - `skills/`: Data files for different skills like woodcutting and mining.

### `views/`

- **Purpose**: Page-level components or views that represent different screens in the app.
- **Examples**:
  - `dashboard/`: Components related to the dashboard view.
  - `combat/`: Components related to the combat view.

### `stores/`

- **Purpose**: Zustand stores for managing application state.
- **Examples**:
  - `features/`: Feature-specific stores like skill-store and inventory-store.
  - `global-store.ts`: A store for global application state.

### `types/`

- **Purpose**: TypeScript type definitions for ensuring type safety.
- **Examples**:
  - `skill.types.ts`: Type definitions for skills.
  - `item.types.ts`: Type definitions for items.

### `utils/`

- **Purpose**: Utility functions that provide common functionality across the app.
- **Examples**:
  - `calculations.ts`: Functions for performing calculations.
  - `formatters.ts`: Functions for formatting data.

### `hooks/`

- **Purpose**: Custom React hooks for encapsulating reusable logic.
- **Examples**:
  - `useGameTick.ts`: A hook for managing game ticks.
  - `useSaveGame.ts`: A hook for saving game state.

### `constants/`

- **Purpose**: Store constant values used throughout the app.
- **Examples**:
  - `game-constants.ts`: Constants related to game mechanics.
  - `local-storage-keys.ts`: Keys for local storage.

### `routes/`

- **Purpose**: Define routing components and logic.
- **Examples**:
  - `index.tsx`: Main routing configuration.

### `game/`

- **Purpose**: Core game logic, including the game loop and mechanics.
- **Subdirectories**:
  - `loop/`: Contains the game loop and tick management logic.
  - `mechanics/`: Contains logic for various game mechanics.
- **Examples**:
  - `gameLoop.ts`: Manages the main game loop.
  - `combatMechanics.ts`: Logic for combat mechanics.
