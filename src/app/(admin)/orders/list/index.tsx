import { ActivityIndicator, FlatList, Text } from 'react-native';
import OrderItemListItem from '@/components/OrderListItem';
import { useAdminOrderList } from '@/api/orders';

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useAdminOrderList();

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch</Text>;
  }

  return (
    // TODO
    <FlatList
      data={orders}
      renderItem={({ item }) => {
        return <OrderItemListItem order={item} />;
      }}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
}
