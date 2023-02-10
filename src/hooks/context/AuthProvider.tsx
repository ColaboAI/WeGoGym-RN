import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLoginMutation } from '../queries/user.queries';
import { save, getValueFor, clear } from '@store/secureStore';
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
  refreshToken: () => void;
};

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
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
};

const AuthValueContext = createContext<AuthState>(initialAuthState);
const AuthActionsContext = createContext<AuthActions>(initialAuthActions);

type AuthProviderProps = PropsWithChildren;

function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  const loginMutation = useLoginMutation();

  const authActions = useMemo(
    () => ({
      signIn: async (phoneNumber: string | null) => {
        if (phoneNumber === null) {
          clear('phone_number');
          return;
        }
        await save('phone_number', phoneNumber);
        loginMutation.mutate(phoneNumber);

        if (phoneNumber === null) {
          return;
        }
        // TODO: token vs user_token
        await save('token', phoneNumber);
        console.log('signIn', phoneNumber);
        setAuthState(prevState => ({
          ...prevState,
          token: phoneNumber,
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
          isLoading: true,
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
      refreshToken: () => {
        console.log('refreshToken');
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const isToken = await authActions.getTokenFromStorage();
        const phoneNumber = await getValueFor('phone_number');
        if (!isToken && !phoneNumber) {
          authActions.signOut();
          return;
        }

        if (isToken) {
        }
        if (!isToken && phoneNumber) {
          authActions.signIn(phoneNumber);
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
