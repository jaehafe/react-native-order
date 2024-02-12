import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useCartContext } from '@/providers/CartProvider';
import CartListItem from '@/components/CartListItem';

export default function CartScreen() {
  const { items } = useCartContext();

  return (
    <View>
      <FlatList
        data={items}
        renderItem={({ item }) => {
          return <CartListItem cartItem={item} />;
        }}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
