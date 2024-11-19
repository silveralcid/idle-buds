src/
├── assets/
│ ├── images/
│ └── icons/
├── components/
│ ├── common/
│ │ ├── Button.tsx
│ │ ├── Modal.tsx
│ │ └── ProgressBar.tsx
│ └── game/
│ ├── SkillCard.tsx
│ ├── ResourceDisplay.tsx
│ └── ActionButton.tsx
├── data/
│ ├── items/
│ │ ├── weapons.ts
│ │ ├── resources.ts
│ │ └── equipment.ts
│ ├── skills/
│ │ ├── woodcutting.ts
│ │ ├── mining.ts
│ │ └── crafting.ts
│ ├── monsters/
│ │ ├── bosses.ts
│ │ └── regular-monsters.ts
│ └── game-config/
│ ├── xp-tables.ts
│ └── drop-rates.ts
├── views/
│ ├── dashboard/
│ │ ├── DashboardView.tsx
│ │ └── components/
│ ├── skills/
│ │ ├── SkillsView.tsx
│ │ └── components/
│ ├── combat/
│ │ ├── CombatView.tsx
│ │ └── components/
│ ├── inventory/
│ │ ├── InventoryView.tsx
│ │ └── components/
│ └── bank/
│ ├── BankView.tsx
│ └── components/
├── stores/
│ ├── features/
│ │ ├── skill-store.ts
│ │ ├── inventory-store.ts
│ │ └── combat-store.ts
│ └── global-store.ts
├── types/
│ ├── skill.types.ts
│ ├── item.types.ts
│ └── monster.types.ts
├── utils/
│ ├── calculations.ts
│ ├── formatters.ts
│ └── local-storage.ts
├── hooks/
│ ├── useGameTick.ts
│ ├── useSkillProgress.ts
│ └── useSaveGame.ts
├── constants/
│ ├── game-constants.ts
│ └── local-storage-keys.ts
├── routes/
│ └── index.tsx
├── App.tsx
└── main.tsx
