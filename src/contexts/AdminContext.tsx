'use client';

import { createContext, useContext, useState } from 'react';
import type {
  AdminResultsDto,
  PublishResultDto,
  ResultPayload,
  PaginatedResponseOfAllDepositDto,
} from '../types/api';
import { AdminService } from '@/services/AdminService';

interface AdminContextValue {
  adminResults: AdminResultsDto | null;
  getAdminResults: (body: ResultPayload) => Promise<AdminResultsDto | null>;
  publishResults: (data: PublishResultDto) => Promise<void>;
  getAllDeposits: (pageNumber: number, pageSize: number) => Promise<PaginatedResponseOfAllDepositDto>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminResults, setAdminResults] = useState<AdminResultsDto | null>(
    null
  );

  const getAdminResults = async (body: ResultPayload) => {
    const res = await AdminService.getAdminResults(body);
    setAdminResults(res.data);
    return res.data;
  };

  const publishResults = async (data: PublishResultDto) => {
    const res = await AdminService.publishResults(data);
    setAdminResults(res.data);
  };

  const getAllDeposits = async (pageNumber: number, pageSize: number) => {
    return AdminService.getAllDeposits(pageNumber, pageSize);
  };
  return (
    <AdminContext.Provider
      value={{
        adminResults,
        getAdminResults,
        publishResults,
        getAllDeposits,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within a AdminProvider');
  }
  return context;
};
