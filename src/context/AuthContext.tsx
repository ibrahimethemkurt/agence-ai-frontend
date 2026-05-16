import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  decodeUserFromToken,
  type LoginRequest,
  type RegisterRequest,
  type UserResponse,
} from '../api/auth.api';
import { tokenStorage } from '../api/client';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface AuthState {
  user: Partial<UserResponse> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<UserResponse>;
  logout: () => void;
}

// ────────────────────────────────────────────
// Context
// ────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Başlangıçta token kontrol edene kadar loading
  });

  // Sayfa yenilendiğinde localStorage'daki token'ı kontrol et
  useEffect(() => {
    const token = tokenStorage.get();

    if (token) {
      const decoded = decodeUserFromToken(token);
      if (decoded) {
        setState({ user: decoded, isAuthenticated: true, isLoading: false });
      } else {
        // Token bozuk
        tokenStorage.clear();
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = useCallback(async (data: LoginRequest): Promise<void> => {
    const response = await apiLogin(data); // token storage'a kaydedilir
    const decoded = decodeUserFromToken(response.access_token);
    setState({ user: decoded, isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (data: RegisterRequest): Promise<UserResponse> => {
    return apiRegister(data);
  }, []);

  const logout = useCallback((): void => {
    apiLogout();
    setState({ user: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ────────────────────────────────────────────
// Hook (güvenli erişim)
// ────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
