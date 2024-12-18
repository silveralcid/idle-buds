export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number; // -1 for infinite
} 