import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { save, getValueFor, clear } from '@store/secureStore';
import { postLogin } from '@/api/api';
type AuthState = {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
  error: string | null;
};

type AuthActions = {
  signIn: (phoneNumber: string | null) => void;
  signOut: () => void;
  signUp: (phoneNumber: string | null) => void;
  getTokenFromStorage: () => Promise<boolean>;
  refreshToken: (a: string, b: string) => void;
  setLoading: (b: boolean) => void;
};

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isSignout: false,
  error: null,
};

const initialAuthActions: AuthActions = {
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  getTokenFromStorage: async () => {
    return false;
  },
  refreshToken: () => {},
  setLoading: () => {},
};

const AuthValueContext = createContext<AuthState>(initialAuthState);
const AuthActionsContext = createContext<AuthActions>(initialAuthActions);

type AuthProviderProps = PropsWithChildren;

function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  const authActions = useMemo(
    () => ({
      signIn: async (phoneNumber: string | null) => {
        if (phoneNumber === null) {
          clear('phoneNumber');
          return;
        }
        await save('phoneNumber', phoneNumber);

        const { token, refreshToken } = await postLogin(phoneNumber);

        await save('token', token);
        await save('refreshToken', refreshToken);

        setAuthState(prevState => ({
          ...prevState,
          token: token,
          isSignout: false,
          isLoading: false,
        }));
      },
      signOut: async () => {
        await clear('token');
        setAuthState(prevState => ({
          ...prevState,
          token: null,
          isSignout: true,
          isLoading: false,
        }));
      },
      signUp: async (phoneNumber: string | null) => {
        setAuthState(prevState => ({
          ...prevState,
          isSignout: false,
          token: phoneNumber,
        }));
        if (phoneNumber === null) {
          return;
        }
        await save('token', phoneNumber);
      },
      getTokenFromStorage: async () => {
        const token = await getValueFor('token');

        if (token) {
          setAuthState(prevState => ({
            ...prevState,
            token: token,
            isSignout: false,
          }));
          return true;
        }
        return false;
      },
      refreshToken: async (token: string, refreshToken: string) => {
        await save('token', token);
        await save('refreshToken', refreshToken);
        setAuthState(prevState => ({
          ...prevState,
          isLoading: false,
          token: token,
        }));
      },
      setLoading: (b: boolean) => {
        setAuthState(prevState => ({
          ...prevState,
          isLoading: b,
        }));
      },
    }),
    [],
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const isToken = await authActions.getTokenFromStorage();
        if (!isToken) {
        }
      } catch (e) {
        console.log(e);
      }
    };
    bootstrapAsync();
  }, [authActions, authState.token]);
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
