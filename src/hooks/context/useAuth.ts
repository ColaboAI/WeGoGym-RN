import { useContext } from 'react';
import { AuthActionsContext, AuthValueContext } from './AuthProvider';
function useAuthValue() {
  const value = useContext(AuthValueContext);
  if (value === undefined) {
    throw new Error('useAuthValue should be used within CounterProvider');
  }
  return value;
}

function useAuthActions() {
  const value = useContext(AuthActionsContext);
  if (value === undefined) {
    throw new Error('useAuthActions should be used within CounterProvider');
  }
  return value;
}

export { useAuthValue, useAuthActions };
