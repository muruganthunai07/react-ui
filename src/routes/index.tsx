import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import Home from '../pages/Home';
import { AuthProvider } from '../contexts/auth-context';
import { AdminProvider } from '@/contexts/AdminContext';
import { CartProvider } from '../contexts/cart-context';
import { NavbarProvider } from '../contexts/navbar-context';
import { Navigation } from '../components/navigation';
import FloatingNav from '../components/floating-nav';
import { ResultsContent } from '@/components/results-content';
import ThreeDigitGamePage from '@/pages/ThreeDigitGamePage';
import { Toaster } from 'sonner';
import LoadingBarProvider from '@/components/loadingComponent';
import { DashboardProvider } from '@/contexts/dasboard-context';
import SettingsPage from '@/pages/Settings';
import ProfilePage from '@/pages/Profile';
import DepositPage from '@/pages/Deposit';
import WithdrawPage from '@/pages/Withdraw';
import CartPage from '@/pages/Cart';
import { GameProvider } from '@/contexts/GameContext';
import AdminRoute from './AdminRouter';
import AdminIndexPage from '@/pages/AdminIndex';
import GameManagement from '@/pages/GameManagement';
import ResultsPage from '@/pages/Results';
import LotPricingPage from '@/pages/LotPricing';
import ReportsPage from '@/pages/Reports';
import SaleReportView from '@/pages/report-view/SaleReportView';
import CostReportView from '@/pages/report-view/CostReportView';
import DrawReportView from '@/pages/report-view/DrawReportView';
import AdminDepositsPage from '@/pages/AdminDeposit';
import AdminUsersPage from '@/pages/UserManagement';
import AdminSettingsPage from '@/pages/AdminSettings';
import AdminConfigurationsPage from '@/pages/AdminConfigurations';
import { UserProvider } from '@/contexts/UserContext';
import ErrorPage from '../components/ErrorPage';
import NotFoundPage from '../components/NotFoundPage';

function RootLayout() {
  const location = useLocation();
  const isHidden = () => {
    return (
      location.pathname.includes('/cart') ||
      (location.pathname.includes('/deposit') &&
        !location.pathname.includes('/admin')) ||
      location.pathname.includes('/withdraw')
    );
  };
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <DashboardProvider>
            <GameProvider>
              <LoadingBarProvider>
                <NavbarProvider>
                  <UserProvider>
                    <div className='flex min-h-screen'>
                      <Navigation />
                      <div
                        className={`flex-1 ${
                          isHidden() ? 'w-full' : 'md:ml-[240px] w-full'
                        }`}
                      >
                        {/* <App /> */}
                        <Outlet />
                      </div>
                      <FloatingNav />
                    </div>
                    <Toaster position='top-right' richColors swipeDirections={['top' ,'right' , 'left']} />
                  </UserProvider>
                </NavbarProvider>
              </LoadingBarProvider>
            </GameProvider>
          </DashboardProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Common layout
    errorElement: <ErrorPage />, // Custom error page
    children: [
      { index: true, element: <Home /> },
      { path: '/results', element: <ResultsContent /> },
      {
        path: '/3-digit-game/',
        element: <Navigate to='/3-digit-game/dear/2' />,
      },
      { path: '/3-digit-game/:type/:id', element: <ThreeDigitGamePage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/deposit', element: <DepositPage /> },
      { path: '/withdraw', element: <WithdrawPage /> },
      { path: '/cart', element: <CartPage /> },

      // 🔐 Admin Protected Routes
      {
        path: '/admin',
        element: <AdminRoute />,
        children: [
          { index: true, element: <AdminIndexPage /> },
          // { path: '/admin/dashboard', element: <AdminDashboardPage /> },
          { path: '/admin/games', element: <GameManagement /> },
          { path: '/admin/results', element: <ResultsPage /> },
          { path: '/admin/lot-pricing', element: <LotPricingPage /> },
          { path: '/admin/reports', element: <ReportsPage /> },
          { path: '/admin/reports/sales/results', element: <SaleReportView /> },
          { path: '/admin/reports/cost/results', element: <CostReportView /> },
          { path: '/admin/reports/draw/results', element: <DrawReportView /> },
          { path: '/admin/deposits', element: <AdminDepositsPage /> },
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/settings', element: <AdminSettingsPage /> },
          { path: '/admin/configurations', element: <AdminConfigurationsPage /> },
        ],
      },
      // Error route for navigation
      {
        path: '/error',
        element: <ErrorPageWrapper />,
      },
      // Catch-all route for 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

// Wrapper to extract errorCode from location.state
function ErrorPageWrapper() {
  const location = useLocation();
  const errorCode = location.state?.errorCode;
  return <ErrorPage errorCode={errorCode} />;
}
