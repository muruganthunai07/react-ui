import { AdminService } from '@/services/AdminService';
import type { AllUsersDto } from '@/types/api';
import type React from 'react';
import { createContext, useContext, useState } from 'react';

type UserContextType = {
  getAllUsers: () => Promise<void>;
  users: AllUsersDto[] | [];
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AllUsersDto[] | []>([]);
  const getAllUsers = async () => {
    try {
      const allUsers = await AdminService.getUsers();
      setUsers(allUsers.data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <UserContext.Provider value={{ users, getAllUsers }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a NavbarProvider');
  }
  return context;
}
