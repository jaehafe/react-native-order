import * as React from 'react';
import { FlatList, View } from 'react-native';
import ProductListItem from '@/components/ProductListItem';
import { useProductList } from '@/api/products';

export default function MenuScreen() {
  const { data: products, isLoading, error } = useProductList();

  return (
    <View>
      <FlatList
        data={products}
        renderItem={({ item }) => {
          return <ProductListItem product={item} />;
        }}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
}
