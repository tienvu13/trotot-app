import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  name: string;
  email: string;
  role: string;
};

type Account = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: string) => boolean;
  logout: () => void;
};

const STORAGE_ACCOUNTS = 'auth_accounts';
const STORAGE_USER = 'auth_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_ACCOUNTS)
      .then((saved) => {
        if (!saved) {
          return;
        }

        const parsed = JSON.parse(saved) as Account[];
        setAccounts(parsed);
      })
      .catch(() => {
        setAccounts([]);
      });

    AsyncStorage.getItem(STORAGE_USER)
      .then((saved) => {
        if (!saved) {
          return;
        }

        const parsed = JSON.parse(saved) as User;
        setUser(parsed);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(accounts)).catch(() => {
      // ignore failures
    });
  }, [accounts]);

  useEffect(() => {
    if (user) {
      AsyncStorage.setItem(STORAGE_USER, JSON.stringify(user)).catch(() => {
        // ignore failures
      });
    } else {
      AsyncStorage.removeItem(STORAGE_USER).catch(() => {
        // ignore failures
      });
    }
  }, [user]);

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = accounts.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
    );

    if (!account) {
      return false;
    }

    setUser({ name: account.name, email: account.email, role: account.role });
    return true;
  };

  const register = (name: string, email: string, password: string, role: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (accounts.some((item) => item.email.toLowerCase() === normalizedEmail)) {
      return false;
    }

    const account: Account = { name: name.trim(), email: normalizedEmail, password, role };
    setAccounts((prev) => [...prev, account]);
    setUser({ name: account.name, email: account.email, role });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, accounts],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
