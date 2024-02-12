import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';

type ButtonProps = {
  text: string;
  disabled: boolean;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = React.forwardRef<View | null, ButtonProps>(({ text, disabled, ...pressableProps }, ref) => {
  return (
    <Pressable ref={ref} {...pressableProps} style={[styles.container, disabled && styles.disabled]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
