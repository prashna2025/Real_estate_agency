import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminInfo');
    const storedUser = localStorage.getItem('userInfo');
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        if (parsedAdmin?.token) {
          setAdmin(parsedAdmin);
          api.defaults.headers.common['Authorization'] = `Bearer ${parsedAdmin.token}`;
        } else {
          localStorage.removeItem('adminInfo');
        }
      } catch {
        localStorage.removeItem('adminInfo');
      }
    }
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.token) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('userInfo');
        }
      } catch {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/admin/login', { email, password });
    setAdmin(data);
    localStorage.setItem('adminInfo', JSON.stringify(data));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminInfo');
    delete api.defaults.headers.common['Authorization'];
  };

  const userLogin = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const userRegister = async (name, email, password) => {
    const { data } = await api.post('/users/register', { name, email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const userLogout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, user, userLogin, userRegister, userLogout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);