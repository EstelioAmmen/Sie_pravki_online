import { useState } from 'react';
import { InventoryItem } from '@/types';

export function useCart() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<InventoryItem[]>([]);

  const toggleItemInCart = (id: string) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === id);
      
      if (existingItemIndex !== -1) {
        // Remove item from cart
        return prevItems.filter((_, index) => index !== existingItemIndex);
      } else {
        // Add new item to cart
        const newItem = document.querySelector(`[data-item-id="${id}"]`);
        if (!newItem) return prevItems;

        const itemData = JSON.parse(newItem.getAttribute('data-item-json') || '{}');
        return [...prevItems, { ...itemData, inCart: true }];
      }
    });
  };

  return {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    toggleItemInCart
  };
}