import type React from 'react';

import rolesdata from '../data/roles-data.json';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Calculator,
  ChevronDown,
  CreditCard,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Trophy,
  Users,
  Cog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth-context';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Game Management',
    href: '/admin/games',
    icon: Home,
  },
  {
    title: 'Results',
    href: '/admin/results',
    icon: Trophy,
  },
  {
    title: 'Lot Pricing',
    href: '/admin/lot-pricing',
    icon: Calculator,
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'Approvals',
    href: '/admin/deposits',
    icon: CreditCard,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Admin Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    title: 'Configurations',
    href: '/admin/configurations',
    icon: Cog,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const router = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  // Find current page title
  const currentPage = adminNavItems.find((item) => item.href === pathname);
  const pageTitle = currentPage?.title || 'Admin';

  const userScreens =
    user?.role != null
      ? rolesdata[user.role as keyof typeof rolesdata]?.screens
      : [];

  return (
    <div className='min-h-screen bg-background'>
      {/* Admin Header */}
      <header className='sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-14 items-center'>
          <div className='flex flex-1 items-center justify-between'>
            <div className='flex items-center gap-2'>
              {/* Mobile Menu */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant='ghost' size='icon' className='md:hidden'>
                    <Menu className='h-5 w-5' />
                    <span className='sr-only'>Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side='left' className='w-[240px] sm:w-[300px]'>
                  <SheetHeader className='border-b pb-4 mb-4'>
                    <SheetTitle className='text-left'>Admin Menu</SheetTitle>
                  </SheetHeader>

                  {/* Navigation items */}
                  <div className='flex flex-col space-y-1'>
                    {adminNavItems
                      ?.filter((page) => userScreens?.includes(page.href))
                      ?.map((item) => (
                        <Button
                          key={item.href}
                          variant={
                            pathname === item.href ? 'secondary' : 'ghost'
                          }
                          className='justify-start'
                          onClick={() => {
                            router(item.href);
                            setOpen(false);
                          }}
                        >
                          <item.icon className='mr-2 h-4 w-4' />
                          {item.title}
                        </Button>
                      ))}
                  </div>

                  {/* Exit to Home Page button - ADDED THIS */}
                  <div className='mt-auto pt-4 border-t mt-4'>
                    <Button
                      variant='default'
                      className='w-full justify-start'
                      onClick={() => {
                        router('/');
                        setOpen(false);
                      }}
                    >
                      <Home className='mr-2 h-4 w-4' />
                      Exit to Home Page
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <h1 className='text-lg font-semibold'>{pageTitle}</h1>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex md:items-center md:gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='gap-1'>
                    Navigate
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {adminNavItems
                    ?.filter((page) => userScreens?.includes(page.href))
                    ?.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          to={item.href}
                          className='flex items-center cursor-pointer'
                        >
                          <item.icon className='mr-2 h-4 w-4' />
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant='outline' asChild>
                <Link to='/'>Exit Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container py-4 md:py-6'>{children}</main>
    </div>
  );
}
