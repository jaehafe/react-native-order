import * as React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '@/components/@common/Button';
import Colors from '@/constants/Colors';
import { defaultImage } from '@/components/ProductListItem';
import * as ImagePicker from 'expo-image-picker';

export default function CreateProductScreen() {
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [image, setImage] = React.useState<string | null>(null);

  const resetFields = () => {
    setName('');
    setPrice('');
  };

  const validateInput = () => {
    setErrors('');
    if (!name) {
      setErrors('Name is required');
      return false;
    }
    if (!price) {
      setErrors('Price is required');
      return false;
    }
    if (isNaN(Number(price))) {
      setErrors('Price is not a number');
      return false;
    }
    return true;
  };

  const onCreate = () => {
    if (!validateInput()) {
      return;
    }

    console.warn('생성', name);

    // todo db 저장

    resetFields();
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image || defaultImage }} style={styles.image} />
      <Text style={styles.textButton} onPress={pickImage}>
        Select Image
      </Text>
      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput value={price} onChangeText={setPrice} placeholder="9.99" style={styles.input} keyboardType="numeric" />

      <Text style={styles.errors}>{errors}</Text>
      <Button onPress={onCreate} text="Create" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  errors: {
    color: 'red',
  },
});
