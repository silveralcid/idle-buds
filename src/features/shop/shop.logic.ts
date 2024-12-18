import { useShopStore } from './shop.store';
import { useBankStore } from '../bank/bank.store';

export const canAffordItem = (itemId: string, quantity: number = 1): boolean => {
  const shopStore = useShopStore.getState();
  const bankStore = useBankStore.getState();
  
  const item = shopStore.items.find(i => i.id === itemId);
  if (!item) return false;
  
  const totalCost = item.price * quantity;
  const currentGold = bankStore.items['gold_coin'] || 0;
  
  return currentGold >= totalCost;
};

export const getItemSellPrice = (itemId: string): number => {
  const shopStore = useShopStore.getState();
  const item = shopStore.items.find(i => i.id === itemId);
  
  if (!item) return 0;
  return Math.floor(item.price * 0.5); // 50% of buy price
};
