import React, { createContext, useContext, useState, useEffect } from 'react';

const ADMIN_EMAIL = 'admin@adukeemporium.com';
const ADMIN_PASSWORD = 'AdukeAdmin2026!';
const SESSION_KEY = 'aduke_admin_session';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session === 'authenticated') {
      setIsAdminLoggedIn(true);
    }
    setIsCheckingSession(false);
  }, []);

  const adminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, 'authenticated');
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, isCheckingSession, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
