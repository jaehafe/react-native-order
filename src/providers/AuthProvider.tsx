import * as React from 'react';

export interface AuthContextType {}

const AuthContext = React.createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const authValue = {};

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const authContext = React.useContext(AuthContext);
  if (authContext === null || authContext === undefined) {
    throw new Error('useAuthContext는 Auth Provider 안에서 사용해야 합니다.');
  }
  return authContext;
}
