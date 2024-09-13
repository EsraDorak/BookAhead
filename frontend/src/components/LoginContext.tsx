import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LoginContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginContext = createContext<LoginContextType | null>(null);

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }: LoginProviderProps) => {
  const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
  const savedUserId = localStorage.getItem('userId');
  const savedIsAdmin = localStorage.getItem('isAdmin');
  const [isLoggedIn, setIsLoggedIn] = useState(savedIsLoggedIn === 'true');
  const [userId, setUserId] = useState<string | null>(savedUserId);
  const [isAdmin, setIsAdmin] = useState(savedIsAdmin === 'true');

  useEffect(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const savedUserId = localStorage.getItem('userId');
    const savedIsAdmin = localStorage.getItem('isAdmin');
    setIsLoggedIn(savedIsLoggedIn === 'true');
    setUserId(savedUserId);
    setIsAdmin(savedIsAdmin === 'true');
  }, []);

   // Beim ersten Rendern den Zustand aus dem localStorage laden
   useEffect(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const savedUserId = localStorage.getItem('userId');
    const savedIsAdmin = localStorage.getItem('isAdmin');
    setIsLoggedIn(savedIsLoggedIn === 'true');
    setUserId(savedUserId);
    setIsAdmin(savedIsAdmin === 'true');
  }, []);

  // Wenn sich der Zustand Ãndert, wird es im LocalStorage gespeichert
  useEffect(() => {
    if (isLoggedIn !== null) {
      localStorage.setItem('isLoggedIn', String(isLoggedIn));
    }
    if (userId !== null) {
      localStorage.setItem('userId', userId);
    }
    if (isAdmin !== null) {
      localStorage.setItem('isAdmin', String(isAdmin));
    }
  }, [isLoggedIn, userId, isAdmin]);

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setIsAdmin(false);
    localStorage.setItem('userId', '');
  };
 

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId, setUserId, logout, isAdmin, setIsAdmin}}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
    const context = useContext(LoginContext);
    if (!context) {
      throw new Error('useLoginContext must be used within a LoginProvider');
    }
    return context;
  };


export default LoginContext;

