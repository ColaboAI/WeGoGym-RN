import { createContext, PropsWithChildren, useMemo, useState } from 'react';
import SecureStore from 'expo-secure-store';

type AuthState = {
  user: any | null;
  userToken: string | null;
  isLoading: boolean;
  isSignout: boolean;
  error: string | null;
};

type AuthActions = {
  signIn: (phoneNumber: string | null) => void;
  signOut: () => void;
  signUp: (phoneNumber: string | null) => void;
};

const initialAuthState: AuthState = {
  user: null,
  userToken: null,
  isLoading: false,
  isSignout: false,
  error: null,
};

const initialAuthActions: AuthActions = {
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  // resetPassword: () => {},
  // confirmSignUp: () => {},
  // resendConfirmationCode: () => {},
};

const AuthValueContext = createContext<AuthState>(initialAuthState);
const AuthActionsContext = createContext<AuthActions>(initialAuthActions);

type AuthProviderProps = PropsWithChildren;

function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const authActions = useMemo(
    () => ({
      // TODO: Fix this
      signIn: async (phoneNumber: string | null) => {
        setAuthState(prevState => ({
          ...prevState,
          userToken: 'dummy-auth-token',
        }));
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync('userToken');
        setAuthState(prevState => ({
          ...prevState,
          userToken: null,
          isSignout: true,
        }));
      },
      signUp: async (phoneNumber: string | null) => {
        setAuthState(prevState => ({
          ...prevState,
          isSignout: false,
          userToken: 'dummy-auth-token',
        }));
      },
    }),
    [],
  );
  return (
    <AuthActionsContext.Provider value={authActions}>
      <AuthValueContext.Provider value={authState}>
        {children}
      </AuthValueContext.Provider>
    </AuthActionsContext.Provider>
  );
}

export default AuthProvider;

export { AuthActionsContext, AuthValueContext };
