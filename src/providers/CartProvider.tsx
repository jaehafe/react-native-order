import * as React from 'react';
import { CartItem } from '@/@types';
import { randomUUID } from 'expo-crypto';
import { Tables } from '@/database.types';
import { useInsertOrder } from '@/api/orders';
import { useAuthContext } from './AuthProvider';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useInsertOrderItems } from '@/api/order-items';

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
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const addItem = (product: Tables<'products'>, size: CartItem['size']) => {
    // if already in cart, increment quantity
    const existingItem = items.find((item) => item.product === product && item.size === size);

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      id: randomUUID(), // generate
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => (item.id !== itemId ? item : { ...item, quantity: item.quantity + amount }))
        .filter((item) => item.quantity > 0)
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
        onSuccess: saveOrderItems,
      }
    );
  };

  const saveOrderItems = (order: Tables<'orders'>) => {
    const orderItems = items.map((cartIem) => ({
      order_id: order.id,
      product_id: cartIem.product_id,
      quantity: cartIem.quantity,
      size: cartIem.size,
    }));

    insertOrderItems(orderItems, {
      onSuccess() {
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
    });
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
