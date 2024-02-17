import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useCartContext } from '@/providers/CartProvider';
import CartListItem from '@/components/CartListItem';
import Button from '@/components/@common/Button';

export default function CartScreen() {
  const { items, total, checkout } = useCartContext();

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => {
          return <CartListItem cartItem={item} />;
        }}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />

      <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
      <Button onPress={checkout} text="Checkout" />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  totalText: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: '500',
  },
});
