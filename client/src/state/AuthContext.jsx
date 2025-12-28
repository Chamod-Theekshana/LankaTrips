import React, { createContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    const token = localStorage.getItem('lt_token');
    if (!token) return null;
    const { data } = await api.get('/api/auth/me');
    return data?.data;
  }

  useEffect(() => {
    (async () => {
      try {
        const me = await loadMe();
        if (me) setUser(me);
      } catch (e) {
        localStorage.removeItem('lt_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function register(payload) {
    const { data } = await api.post('/api/auth/register', payload);
    localStorage.setItem('lt_token', data.data.token);
    setUser(data.data.user);
    return data;
  }

  async function login(payload) {
    const { data } = await api.post('/api/auth/login', payload);
    localStorage.setItem('lt_token', data.data.token);
    setUser(data.data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem('lt_token');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, register, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
