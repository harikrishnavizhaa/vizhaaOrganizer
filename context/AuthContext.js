import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, tokenStore } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await tokenStore.getRefresh();
        if (stored) {
          const result = await api.refresh(stored);
          tokenStore.setAccess(result.accessToken);
          await tokenStore.saveRefresh(result.refreshToken);
          setUser(result.user);
        }
      } catch {
        await tokenStore.clearAll();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (accessToken, refreshToken, userData) => {
    tokenStore.setAccess(accessToken);
    await tokenStore.saveRefresh(refreshToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      const stored = await tokenStore.getRefresh();
      if (stored) await api.logout(stored);
    } catch { /* silent */ }
    await tokenStore.clearAll();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
