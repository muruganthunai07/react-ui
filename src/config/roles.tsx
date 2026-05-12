import { ShieldCheck, User, UserCog } from 'lucide-react';

export const ROLE_CONFIG = {
  Admin: {
    icon: <UserCog className="mr-2 h-4 w-4" />,
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  },
  'Super Admin': {
    icon: <ShieldCheck className="mr-2 h-4 w-4" />,
    color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
  },
  User: {
    icon: <User className="mr-2 h-4 w-4" />,
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
  },
  Default: {
    icon: <User className="mr-2 h-4 w-4" />,
    color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
  }
};

export const getRoleConfig = (role: string) => {
  return ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.Default;
}; 