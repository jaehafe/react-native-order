import { useAuthContext } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { session } = useAuthContext();

  if (session) {
    return <Redirect href={'/'} />;
  }

  return <Stack />;
}
