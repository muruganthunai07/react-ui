import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import roleData from '@/data/roles-data.json';

export default function AdminRoute() {
  const { user } = useAuth();
  const pathname = useLocation().pathname;

  if (user === null) {
    return <Navigate to='/' replace />;
  }

  const userRoleData = roleData[user.role as keyof typeof roleData];

  if (!userRoleData?.isAdmin) {
    return <Navigate to='/' replace />;
  }

  if (
    !userRoleData.screens.some((screen) =>
      pathname.startsWith(screen)
    ) &&
    pathname !== '/admin'
  ) {
    return <Navigate to='/admin' replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
