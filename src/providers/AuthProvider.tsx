import * as React from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface ProfileType {
  avatar_url: string | null;
  full_name: string | null;
  group: 'USER' | 'ADMIN';
  id: string | null;
  updated_at: string | null;
  username: string | null;
  website: string | null;
}

export interface AuthContextType {
  session: Session | null;
  profile: ProfileType | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>({
  session: null,
  loading: true,
  profile: {
    avatar_url: null,
    full_name: null,
    group: 'USER',
    id: null,
    updated_at: null,
    username: null,
    website: null,
  },
  isAdmin: false,
});

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<ProfileType | null>(null);

  const isAdmin = profile?.group === 'ADMIN';

  const authData = {
    session,
    profile,
    loading,
    isAdmin,
  };

  React.useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        // fetch profile
        const { data } = await supabase.from('profiles').select('*').eq('id', session?.user.id).single();
        setProfile(data || null);
      }
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
