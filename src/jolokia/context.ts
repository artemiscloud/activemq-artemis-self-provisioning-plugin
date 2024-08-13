import { createContext } from 'react';

export type jolokiaLoginSource = 'api' | 'session';

export type JolokiaLogin = {
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  token: string;
  source: jolokiaLoginSource;
  podOrdinal: number;
};

export const AuthContext = createContext<JolokiaLogin>({
  token: '',
  isLoading: true,
  isSuccess: false,
  isError: false,
  source: 'api',
  podOrdinal: 0,
});
