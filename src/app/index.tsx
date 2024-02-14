import { Text, View } from 'react-native';
import React from 'react';
import Button from '@/components/@common/Button';
import { Link, Redirect } from 'expo-router';
import { useAuthContext } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const { session, loading, isAdmin } = useAuthContext();

  if (loading) {
    return <Text>loading...</Text>;
  }
  if (!session) {
    return <Redirect href={'/sign-in'} />;
  }
  if (!isAdmin) {
    return <Redirect href={'/(user)'} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link href={'/(user)'} asChild>
        <Button text="User" />
      </Link>

      <Link href={'/(admin)'} asChild>
        <Button text="Admin" />
      </Link>

      <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
    </View>
  );
}
