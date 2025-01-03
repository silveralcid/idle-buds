import React, { useState, useMemo } from 'react';
import { useShopStore } from '../features/shop/shop.store';
import { useBankStore } from '../features/bank/bank.store';
import { canAffordItem, getItemBuyPrice } from '../features/shop/shop.logic';
import { foodItems } from '../data/items/food.data';
import { lumberingItems } from '../data/items/log.data';
import { miningItems } from '../data/items/ore.data';

const ShopView: React.FC = () => {
  const bankItems = useBankStore(state => state.items);
  const { purchaseItem, sellItem } = useShopStore();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const shopItems = useMemo(() => [
    ...foodItems,
    ...lumberingItems,
    ...miningItems
  ], []);

  const handleSellAll = (itemId: string) => {
    const quantity = bankItems[itemId] || 0;
    if (quantity > 0) {
      sellItem(itemId, quantity);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shop</h1>
      
      <div className="mb-4">
        <label className="mr-2">Quantity:</label>
        <input
          type="number"
          min="1"
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="border p-1 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopItems.map(item => {
          const buyPrice = getItemBuyPrice(item.id);
          const sellPrice = item.value;
          const ownedQuantity = bankItems[item.id] || 0;
          
          return (
            <div key={item.id} className="border p-4 rounded-lg bg-base-200">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm opacity-75">{item.description}</p>
              <div className="mt-2">
                <p>Buy Price: {buyPrice} gold</p>
                <p>Sell Price: {sellPrice} gold</p>
              </div>
              <p className="mb-2">Owned: {ownedQuantity}</p>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => purchaseItem(item.id, selectedQuantity)}
                  disabled={!canAffordItem(item.id, selectedQuantity)}
                  className="btn btn-primary btn-sm"
                >
                  Buy {selectedQuantity}
                </button>
                
                <button
                  onClick={() => sellItem(item.id, selectedQuantity)}
                  disabled={!bankItems[item.id] || bankItems[item.id] < selectedQuantity}
                  className="btn btn-secondary btn-sm"
                >
                  Sell {selectedQuantity}
                </button>

                <button
                  onClick={() => handleSellAll(item.id)}
                  disabled={ownedQuantity === 0}
                  className="btn btn-accent btn-sm"
                >
                  Sell All ({ownedQuantity})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopView;
