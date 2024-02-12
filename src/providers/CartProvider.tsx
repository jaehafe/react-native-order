import * as React from 'react';
import { CartItem, Product } from '@/@types';
import { randomUUID } from 'expo-crypto';

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: CartItem['size']) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
}

const CartContext = React.createContext<CartContextType | null>(null);

export default function CartProvider({ children }: React.PropsWithChildren) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  const addItem = (product: Product, size: CartItem['size']) => {
    const existingItem = items.find((item) => item.product && item.size === size);
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    // todo 이미 cart에 있으면 quantity ++
    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems((prev) => [...prev, newCartItem]);
  };

  // todo update quantity
  // const updateQuantity = (itemId: string, amount: -1 | 1) => {
  //   const updatedItems = items.map((item) =>
  //     item.id !== itemId ? item : { ...item, quantity: item.quantity + amount }
  //   );
  //   setItems(updatedItems);

  //   const itemToRemove = updatedItems.find((item) => item.id === itemId);
  //   if (itemToRemove && itemToRemove.quantity === 0) {
  //     const remainingItems = updatedItems.filter((item) => item.id !== itemId);
  //     setItems(remainingItems);
  //   }
  // };
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => (item.id !== itemId ? item : { ...item, quantity: item.quantity + amount }))
        .filter((item) => item.quantity !== 0)
    );
  };

  console.log(items);

  const cartValue = {
    items,
    addItem,
    updateQuantity,
  };

  return <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const cartContext = React.useContext(CartContext);
  if (cartContext === null || cartContext === undefined) {
    throw new Error('useCartContext는 Cart Provider 안에서 사용해야 합니다.');
  }
  return cartContext;
}
