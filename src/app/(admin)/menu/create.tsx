import Button from '@/components/@common/Button';
import * as React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function CreateProductScreen() {
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [errors, setErrors] = React.useState('');

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

  return (
    <View style={styles.container}>
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
