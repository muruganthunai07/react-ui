import { createContext, useContext, useState, type ReactNode } from "react";
import { DashboardService } from "@/services/DashboardService";
import {
  type AdminDashboardData,
  type DashboardItem,
  type GameModeDto,
  type ResultPayload,
  type ResultResponse,
} from "@/types/api";
import { AdminService } from "@/services/AdminService";
import ErrorPage from "@/components/ErrorPage";
import momentTz from 'moment-timezone';
import { useAuth } from "./auth-context";

interface DashboardContextType {
  dashboardData: DashboardItem | null;
  setDashboardData: (data: DashboardItem | null) => void;
  getDashboard: (forceRefresh?: boolean) => Promise<DashboardItem | null>;
  keralaGames: GameModeDto[] | null;
  dearGames: GameModeDto[] | null;
  allModes: Record<string, GameModeDto[]>;
  getResults: (body?: ResultPayload) => Promise<ResultResponse | null>;
  results: ResultResponse | null;
  adminDashboardData: AdminDashboardData | null;
  getAdminDasboard: () => Promise<AdminDashboardData | null>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { updateBalance } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardItem | null>(
    null
  );
  const [adminDashboardData, setAdminDasboardData] =
    useState<AdminDashboardData | null>(null);
  const [allModes, setAllModes] = useState<Record<string, GameModeDto[]>>({});
  const [results, setResults] = useState<ResultResponse | null>(null);
  const [dashboardError, setDashboardError] = useState(false);
  // Check timezone on mount
  const validTimezones = ['Asia/Kolkata', 'Asia/Calcutta'];
  if (typeof window !== 'undefined' && !validTimezones.includes(momentTz.tz.guess()) && !dashboardError) {
    setDashboardError(true);
  }
  const getAdminDasboard = async () => {
    try {
      const data = await AdminService.getAdminDashboardData();
      setAdminDasboardData(data);
      return data;
    } catch  {
      console.error("Something Went Wrong");
    }
  };
  const getDashboard = async (forceRefresh?: boolean) => {
    // If dashboard data is already fetched and not forcing refresh, return it
    if (
      !forceRefresh &&
      dashboardData &&
      dashboardData.gameModes &&
      dashboardData.gameModes.length
    )
      return dashboardData;
    // This will be implemented later to fetch dashboard data
    try {
      const data = await DashboardService.getDashboardData();
      const allModes: Record<string, GameModeDto[]> = {};
      if (data?.gameModes) {
        data.gameModes.forEach((game: GameModeDto) => {
          const key = game.name.toLowerCase();
          allModes[key] = allModes[key] || []
          allModes[key].push(game);
        });
      }

      setAllModes(allModes);
      setDashboardData(data);
      
      // Update user balance in auth context if dashboard data contains balance
      if (data?.userBalance) {
        updateBalance(data.userBalance);
      }
      
      setDashboardError(false); // Reset error if successful
      return data;
    } catch (error) {
      setDashboardError(true);
      console.error("Error fetching dashboard data:", error);
    }
  };
  const getResults = async (body?: unknown) => {
    // This will be implemented later to fetch dashboard data
    try {
      const data = await DashboardService.getResults(body);
      setResults(data);
      return data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return dashboardError ? (
    <ErrorPage errorCode={
      !validTimezones.includes(momentTz.tz.guess())
        ? 'Error code: 5567, Invalid timezone - Please set your device timezone to India (Asia/Kolkata)'
        : undefined
    } />
  ) : (
    <DashboardContext.Provider
      value={{
        dashboardData,
        setDashboardData,
        getDashboard,
        keralaGames: allModes["kerala"] || null,
        dearGames: allModes["dear"] || null,
        allModes: allModes,
        getResults,
        results,
        adminDashboardData,
        getAdminDasboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
