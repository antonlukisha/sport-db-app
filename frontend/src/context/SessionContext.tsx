import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'user';

interface SessionContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [role, setRole] = useState<Role>('admin');

  return (
    <SessionContext.Provider value={{ role, setRole }}>
      {children}
    </SessionContext.Provider>
  );
};
