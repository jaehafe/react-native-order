import * as React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import products from '@assets/data/products';
import { defaultImage } from '@/components/ProductListItem';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const size = ['S', 'M', 'L', 'XL'] as const;
type SizeType = (typeof size)[number];

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const product = products.find((product) => String(product.id) === id);

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

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Menu',
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Stack.Screen options={{ title: product?.name }} />
      <Image source={{ uri: product.image || defaultImage }} style={styles.image} />

      <Text style={styles.title}>Title: {product.name}</Text>
      <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
      {/* <Button onPress={addToCart} text="Add to cart" disabled={isButtonDisabled} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
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
