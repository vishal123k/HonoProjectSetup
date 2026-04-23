import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedInfo = localStorage.getItem('userInfo');
    if (savedInfo) {
      setUser(JSON.parse(savedInfo).user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data.user);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};