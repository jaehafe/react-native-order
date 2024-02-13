import { FlatList } from 'react-native';
import OrderItemListItem from '@/components/OrderListItem';
import orders from '@assets/data/orders';

export default function OrdersScreen() {
  return (
    <FlatList
      data={orders}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      renderItem={({ item }) => {
        return <OrderItemListItem order={item} />;
      }}
    />
  );
}
