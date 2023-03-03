import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { save, getValueFor, clear } from '@store/secureStore';
import { postLogin, postRegister, deleteUser } from 'api/api';
import { Alert } from 'react-native';
type AuthState = {
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
  error: string | null;
  phoneNumber: string | null;
  userId: string | null;
};

type AuthActions = {
  signIn: (phoneNumber: string | null) => void;
  signOut: () => void;
  signUp: (userInfo: UserCreate) => void;
  getTokenFromStorage: () => Promise<boolean>;
  refreshToken: (a: string, b: string) => void;
  setLoading: (b: boolean) => void;
  getPhoneNumFromStorage: () => Promise<boolean>;
  unRegister: () => Promise<void>;
};

const initialAuthState: AuthState = {
  token: null,
  isLoading: false,
  isSignout: false,
  error: null,
  phoneNumber: null,
  userId: null,
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
  getPhoneNumFromStorage: async () => {
    return false;
  },
  unRegister: async () => {},
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
        save('phoneNumber', phoneNumber);

        const { token, refreshToken, userId } = await postLogin(phoneNumber);

        save('token', token);
        save('refreshToken', refreshToken);
        save('userId', userId);

        console.log('token: ', token);
        console.log('refreshToken: ', refreshToken);
        console.log('userId: ', userId);
        setAuthState(prevState => ({
          ...prevState,
          token: token,
          isSignout: false,
          isLoading: false,
          userId: userId,
        }));
      },
      signOut: async () => {
        clear('token');
        clear('refreshToken');
        clear('phoneNumber');
        clear('userId');

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
          save('token', token);
          save('refreshToken', refreshToken);
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
        const token = getValueFor('token');
        const userId = getValueFor('userId');

        if (token) {
          setAuthState(prevState => ({
            ...prevState,
            token: token,
            userId: userId,
          }));
          return true;
        }
        return false;
      },
      refreshToken: async (token: string, refreshToken: string) => {
        save('token', token);
        save('refreshToken', refreshToken);
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
      getPhoneNumFromStorage: async () => {
        const phoneNumber = getValueFor('phoneNumber');
        if (phoneNumber) {
          setAuthState(prevState => ({
            ...prevState,
            phoneNumber: phoneNumber,
          }));
          return true;
        }
        return false;
      },
      unRegister: async () => {
        const res = await deleteUser();
        clear('token');
        clear('refreshToken');
        clear('phoneNumber');
        console.log('unRegister', res);

        setAuthState(prevState => ({
          ...prevState,
          token: null,
          isSignout: true,
          isLoading: false,
        }));
      },
    }),
    [],
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const isToken = await authActions.getTokenFromStorage();
        const phoneNumber = getValueFor('phoneNumber');
        if (!isToken) {
          if (phoneNumber) {
            await authActions.signIn(phoneNumber);
          } else {
            await authActions.signOut();
          }
        }
      } catch (e) {
        const err = e as Error;
        Alert.alert('인증 오류가 발생했습니다.', `${err.name}: ${err.message}`);
      }
    };
    bootstrapAsync();
  }, [authActions]);
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
