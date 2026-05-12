'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type NavbarContextType = {
  isNavbarVisible: boolean;
  showNavbar: () => void;
  hideNavbar: () => void;
  toggleNavbar: () => void;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;

  // Auto-hide navbar on specific paths
  const autoHidePaths = [
    '/deposit',
    '/withdraw',
    '/admin',
    '/3-digit-game',
    '/dice-game',
    '/cart',
    '/auth',
  ];

  useEffect(() => {
    // Check if current path should auto-hide navbar
    const shouldHide = autoHidePaths.some((path) => pathname.startsWith(path));
    setIsNavbarVisible(!shouldHide);
  }, [pathname]);

  const showNavbar = () => setIsNavbarVisible(true);
  const hideNavbar = () => setIsNavbarVisible(false);
  const toggleNavbar = () => setIsNavbarVisible((prev) => !prev);

  return (
    <NavbarContext.Provider
      value={{ isNavbarVisible, showNavbar, hideNavbar, toggleNavbar }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}
