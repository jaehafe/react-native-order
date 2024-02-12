import { Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Stack.Screen options={{ title: 'Details ' + id }} />
      <Text style={{ fontSize: 20 }}>ProductDetailScreen id: {id}</Text>
    </View>
  );
}
