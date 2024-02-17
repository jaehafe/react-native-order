import * as React from 'react';
import { CartItem } from '@/@types';
import { randomUUID } from 'expo-crypto';
import { Tables } from '@/database.types';
import { useInsertOrder } from '@/api/orders';
import { useAuthContext } from './AuthProvider';
import { useRouter } from 'expo-router';
import { InsertTables } from '@/@types';
import { Alert } from 'react-native';

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Tables<'products'>, size: CartItem['size']) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: VoidFunction;
}

const CartContext = React.createContext<CartContextType | null>(null);

export default function CartProvider({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const { session } = useAuthContext();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const { mutate: insertOrder } = useInsertOrder();

  const addItem = (product: Tables<'products'>, size: CartItem['size']) => {
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

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => (item.id !== itemId ? item : { ...item, quantity: item.quantity + amount }))
        .filter((item) => item.quantity !== 0)
    );
  };

  const total = items.reduce((sum, item) => (sum += item.product.price * item.quantity), 0);

  const clearCart = () => {
    setItems([]);
  };

  const checkout = () => {
    if (total === 0 || items.length < 1) {
      Alert.alert('nothing to checkout');
      return;
    }
    insertOrder(
      { total, user_id: session?.user.id! },
      {
        onSuccess(data: InsertTables<'orders'>) {
          clearCart();
          router.push(`/(user)/orders/${data.id}`);
        },
      }
    );
  };

  const cartValue = {
    items,
    addItem,
    updateQuantity,
    total,
    checkout,
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
