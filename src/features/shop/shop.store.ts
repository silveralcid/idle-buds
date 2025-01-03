import { create } from 'zustand';
import { useBankStore } from '../bank/bank.store';
import { getItemById } from '../../data/item-registry';
import { getItemBuyPrice } from './shop.logic';

interface ShopState {
  purchaseItem: (itemId: string, quantity: number) => boolean;
  sellItem: (itemId: string, quantity: number) => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  purchaseItem: (itemId: string, quantity: number) => {
    const bankStore = useBankStore.getState();
    const buyPrice = getItemBuyPrice(itemId);
    const totalCost = buyPrice * quantity;
    const currentGold = bankStore.items['gold_coin'] || 0;
    
    if (currentGold < totalCost) return false;
    
    bankStore.removeItem('gold_coin', totalCost);
    bankStore.addItem(itemId, quantity);
    
    return true;
  },

  sellItem: (itemId: string, quantity: number) => {
    const bankStore = useBankStore.getState();
    const item = getItemById(itemId);
    
    if (!item) return;
    
    const sellPrice = item.value;
    bankStore.removeItem(itemId, quantity);
    bankStore.addItem('gold_coin', sellPrice * quantity);
  },
}));
