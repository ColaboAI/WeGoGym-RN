import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { save, getValueFor, clear } from '@store/secureStore';
import { postLogin, postRegister } from '@/api/api';
import { Alert } from 'react-native';
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
  signUp: (userInfo: UserCreate) => void;
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
        await clear('refreshToken');
        await clear('phoneNumber');

        setAuthState(prevState => ({
          ...prevState,
          token: null,
          isSignout: true,
          isLoading: false,
        }));
      },
      signUp: async (userInfo: UserCreate) => {
        setAuthState(prev => ({
          ...prev,
          isLoading: true,
        }));
        try {
          const { token, refreshToken } = await postRegister(userInfo);
          await save('token', token);
          await save('refreshToken', refreshToken);
          setAuthState(prevState => ({
            ...prevState,
            isLoading: false,
            isSignout: false,
            token: token,
          }));
        } catch (e) {
          const err = e as Error;
          Alert.alert('회원가입 실패', `${err.name}: ${err.message}`);
        }
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
      authActions.setLoading(true);
      try {
        const isToken = await authActions.getTokenFromStorage();
        const phoneNumber = await getValueFor('phoneNumber');
        if (!isToken) {
          if (phoneNumber) {
            authActions.signIn(phoneNumber);
          } else {
            authActions.signOut();
          }
        }
      } catch (e) {
        const err = e as Error;
        Alert.alert('인증 오류가 발생했습니다.', `${err.name}: ${err.message}`);
      } finally {
        authActions.setLoading(false);
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
