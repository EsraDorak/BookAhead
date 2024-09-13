import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { postRequest } from "./service";


type RegisterInfo = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginInfo = {
  email: string;
  password: string;
};

type User = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  emailToken: string;
};

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  registerUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loginUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  registerInfo: RegisterInfo;
  updateRegisterInfo: (info: RegisterInfo) => void;
  loginInfo: LoginInfo;
  updateLoginInfo: (info: LoginInfo) => void;
  loginError: any;
  isLoginLoading: boolean;
  registerError: any;
  isRegisterLoading: boolean;
  logoutUser: () => void;
  updateUser: (updatedUser: User) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registerError, setRegisterError] = useState<any>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState<any>(null);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateRegisterInfo = useCallback((info: RegisterInfo) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info: LoginInfo) => {
    setLoginInfo(info);
  }, []);

  const updateUser = useCallback((response: User) => {
    Cookies.set('user', JSON.stringify(response), { expires: 3 });
    setUser(response);
  }, []);

  const registerUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsRegisterLoading(true);
      setRegisterError(null);

      try {
        const response = await postRequest(`http://localhost:5002/api/users/register`, registerInfo);
        setIsRegisterLoading(false);

        if (response.error) {
          setRegisterError(response);
        } else {
          Cookies.set('user', JSON.stringify(response), { expires: 3 });
          setUser(response);
        }
      } catch (error) {
        console.error('Error registering user:', error);
        setIsRegisterLoading(false);
        setRegisterError({ message: 'Internal server error' });
      }
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);

      try {
        const response = await postRequest(`http://localhost:5002/api/users/login`, loginInfo);
        setIsLoginLoading(false);

        if (response.error) {
          setLoginError(response);
        } else {
          Cookies.set('user', JSON.stringify(response), { expires: 3 });
          setUser(response);
        }
      } catch (error) {
        console.error('Error logging in user:', error);
        setIsLoginLoading(false);
        setLoginError({ message: 'Internal server error' });
      }
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    Cookies.remove('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerUser,
        loginUser,
        registerInfo,
        updateRegisterInfo,
        loginInfo,
        updateLoginInfo,
        loginError,
        isLoginLoading,
        registerError,
        isRegisterLoading,
        logoutUser,
        updateUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
