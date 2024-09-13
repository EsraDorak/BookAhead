import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Owner {
  id: string;
  restaurantName: string;
}

interface OwnerContextProps {
  owner: Owner | null;
  setOwner: (owner: Owner | null) => void;
  logout: () => void;
}

interface OwnerProviderProps {
  children: ReactNode;
}

const OwnerContext = createContext<OwnerContextProps | undefined>(undefined);

export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error('useOwner must be used within an OwnerProvider');
  }
  return context;
};

export const OwnerProvider: React.FC<OwnerProviderProps> = ({ children }) => {
  const [owner, setOwnerState] = useState<Owner | null>(() => {
    const savedOwner = localStorage.getItem('owner');
    return savedOwner ? JSON.parse(savedOwner) : null;
  });

  useEffect(() => {
    if (owner) {
      localStorage.setItem('owner', JSON.stringify(owner));
    } else {
      localStorage.removeItem('owner');
    }
  }, [owner]);

  const setOwner = (owner: Owner | null) => {
    setOwnerState(owner);
  };

  const logout = () => {
    setOwner(null);
  };

  return (
    <OwnerContext.Provider value={{ owner, setOwner, logout }}>
      {children}
    </OwnerContext.Provider>
  );
};
