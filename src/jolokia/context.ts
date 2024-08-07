import { createContext } from 'react';

export type jolokiaLoginSource = 'api' | 'session';

export type JolokiaLogin = {
  isSucces: boolean;
  isLoading: boolean;
  isError: boolean;
  token: string;
  source: jolokiaLoginSource;
};

export const AuthContext = createContext<JolokiaLogin>({
  token: '',
  isLoading: true,
  isSucces: false,
  isError: false,
  source: 'api',
});
