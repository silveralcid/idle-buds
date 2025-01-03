import { useBankStore } from '../bank/bank.store';
import { getItemById } from '../../data/item-registry';

export const getItemBuyPrice = (itemId: string): number => {
  const item = getItemById(itemId);
  return item ? item.value * 2 : 0;
};

export const canAffordItem = (itemId: string, quantity: number = 1): boolean => {
  const bankStore = useBankStore.getState();
  const buyPrice = getItemBuyPrice(itemId);
  const totalCost = buyPrice * quantity;
  const currentGold = bankStore.items['gold_coin'] || 0;
  
  return currentGold >= totalCost;
};

export const getItemSellPrice = (itemId: string): number => {
  const item = getItemById(itemId);
  return item ? item.value : 0;
};  
