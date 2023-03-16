import { useContext } from 'react';
import {
  SnackBarActionsContext,
  SnackBarValueContext,
} from './SnackBarProvider';

function useSnackBarValue() {
  const value = useContext(SnackBarValueContext);
  if (value === undefined) {
    throw new Error('useSnackBarValue should be used within CounterProvider');
  }
  return value;
}

function useSnackBarActions() {
  const value = useContext(SnackBarActionsContext);
  if (value === undefined) {
    throw new Error('useSnackBarActions should be used within CounterProvider');
  }
  return value;
}

export { useSnackBarValue, useSnackBarActions };
