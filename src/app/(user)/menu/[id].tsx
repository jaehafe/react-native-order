import * as React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { defaultImage } from '@/components/ProductListItem';
import Button from '@/components/@common/Button';
import { useCartContext } from '@/providers/CartProvider';
import { useProduct } from '@/api/products';

const size = ['S', 'M', 'L', 'XL'] as const;
type SizeType = (typeof size)[number];

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  // const product = products.find((product) => String(product.id) === id);

  const router = useRouter();
  const { addItem } = useCartContext();
  const [selectedSize, setSelectedSize] = React.useState<SizeType | null>('M');

  const { data: product, isLoading, error } = useProduct(parseInt(typeof id === 'string' ? id : id[0]));

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error || !product) {
    return <Text>Failed to fetch product</Text>;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.goBack}>
          <Text style={styles.goBackText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const addToCart = () => {
    if (!product) return;

    if (selectedSize) {
      addItem(product, selectedSize);
    }
    router.push('/cart');
  };

  const onClickSize = (size: SizeType) => {
    if (size === selectedSize) {
      return setSelectedSize(null);
    }
    setSelectedSize(size);
  };

  const isButtonDisabled = selectedSize === null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name }} />
      <Image source={{ uri: product.image || defaultImage }} style={styles.image} />
      <Text>Select size</Text>
      <View style={styles.sizes}>
        {size.map((size) => (
          <Pressable
            key={size}
            style={[
              styles.size,
              {
                backgroundColor: size === selectedSize ? 'gainsboro' : 'white',
              },
            ]}
            onPress={() => onClickSize(size)}
          >
            <Text style={[styles.sizeText, { color: size === selectedSize ? 'black' : 'gray' }]}>{size}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
      <Button onPress={addToCart} text="Add to cart" disabled={isButtonDisabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    flex: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  subtitle: {
    marginVertical: 10,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
  },

  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  size: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
  },

  goBack: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  goBackText: {
    fontSize: 16,
    color: 'white',
  },
});
