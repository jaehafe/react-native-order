import * as React from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>({ session: null, loading: true });

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const authData = {
    session,
    loading,
  };

  React.useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const authContext = React.useContext(AuthContext);
  if (authContext === null || authContext === undefined) {
    throw new Error('useAuthContext는 Auth Provider 안에서 사용해야 합니다.');
  }
  return authContext;
}
