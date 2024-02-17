import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  return (
    <View>
      <Text>Profile Sign out</Text>

      <Button title="Sign out" onPress={async () => await supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({});
