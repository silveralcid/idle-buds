import { create } from 'zustand';
import { useBankStore } from '../bank/bank.store';
import { ShopItem } from '../../types/shop.types';

interface ShopState {
  items: ShopItem[];
  purchaseItem: (itemId: string, quantity: number) => boolean;
  sellItem: (itemId: string, quantity: number) => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  items: [ //filler for now
    {
      id: 'copper_pickaxe',
      name: 'Copper Pickaxe',
      description: 'A basic mining tool',
      price: 50,
      category: 'tools',
      stock: -1, // -1 means infinite
    },
    {
      id: 'copper_axe',
      name: 'Copper Axe',
      description: 'A basic woodcutting tool',
      price: 50,
      category: 'tools',
      stock: -1,
    },
  ],

  purchaseItem: (itemId: string, quantity: number) => {
    const bankStore = useBankStore.getState();
    const item = get().items.find(i => i.id === itemId);
    
    if (!item) return false;
    
    const totalCost = item.price * quantity;
    const currentGold = bankStore.items['gold_coin'] || 0;
    
    if (currentGold < totalCost) return false;
    
    // Remove gold and add item
    bankStore.removeItem('gold_coin', totalCost);
    bankStore.addItem(itemId, quantity);
    
    return true;
  },

  sellItem: (itemId: string, quantity: number) => {
    const bankStore = useBankStore.getState();
    const item = get().items.find(i => i.id === itemId);
    
    if (!item) return;
    
    const sellPrice = Math.floor(item.price * 0.5); // 50% of buy price
    bankStore.removeItem(itemId, quantity);
    bankStore.addItem('gold_coin', sellPrice * quantity);
  },
}));
