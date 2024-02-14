import { Text, View } from 'react-native';
import React from 'react';
import Button from '@/components/@common/Button';
import { Link, Redirect } from 'expo-router';
import { useAuthContext } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const { session, loading } = useAuthContext();

  if (loading) {
    return <Text>loading...</Text>;
  }
  if (!session) {
    return <Redirect href={'/sign-in'} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link href={'/(user)'} asChild>
        <Button text="User" />
      </Link>

      <Link href={'/(admin)'} asChild>
        <Button text="Admin" />
      </Link>

      <Link href={'/sign-in'} asChild>
        <Button text="Sign in" />
      </Link>

      <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
    </View>
  );
}
