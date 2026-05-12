import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { ThemeColor } from '@/lib/theme-colors';

export type { ThemeColor } from '@/lib/theme-colors';

export type ThemeOpacity = 0 | 0.3 | 0.5 | 0.75 | 1.0;

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeSettings {
  theme: Theme;
  color: ThemeColor;
  opacity: ThemeOpacity;
  borderRadius: string;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultColor?: ThemeColor;
  defaultOpacity?: ThemeOpacity;
  defaultBorderRadius?: string;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  color: ThemeColor;
  opacity: ThemeOpacity;
  borderRadius: string;
  setTheme: (theme: Theme) => void;
  setColor: (color: ThemeColor) => void;
  setOpacity: (opacity: ThemeOpacity) => void;
  setBorderRadius: (radius: string) => void;
  setThemeSettings: (settings: Partial<ThemeSettings>) => void;
}

const initialState: ThemeProviderState = {
  theme: 'system',
  color: 'default',
  opacity: 1.0,
  borderRadius: 'md',
  setTheme: () => null,
  setColor: () => null,
  setOpacity: () => null,
  setBorderRadius: () => null,
  setThemeSettings: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColor = 'default',
  defaultOpacity = 1.0,
  defaultBorderRadius = 'md',
  storageKey = 'royal-games-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [color, setColor] = useState<ThemeColor>(defaultColor);
  const [opacity, setOpacity] = useState<ThemeOpacity>(defaultOpacity);
  const [borderRadius, setBorderRadius] = useState<string>(defaultBorderRadius);

  useEffect(() => {
    const savedSettings = localStorage.getItem(storageKey);

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings) as ThemeSettings;
        setTheme(settings.theme || defaultTheme);
        setColor(settings.color || defaultColor);
        setOpacity(settings.opacity || defaultOpacity);
        setBorderRadius(settings.borderRadius || defaultBorderRadius);
      } catch (e) {
        console.error('Error parsing theme settings', e);
      }
    } else if (defaultTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      setTheme(systemTheme);
    }
  }, [
    defaultTheme,
    defaultColor,
    defaultOpacity,
    defaultBorderRadius,
    storageKey,
  ]);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark');
    root.classList.remove(
      'theme-red',
      'theme-rose',
      'theme-orange',
      'theme-green',
      'theme-blue',
      'theme-yellow',
      'theme-violet',
      'theme-pink',
      'theme-indigo',
      'theme-cyan',
      'theme-emerald'
    );

    // Apply theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Apply color theme
    if (color !== 'default') {
      root.classList.add(`theme-${color}`);
    }

    // Apply border radius
    root.style.setProperty('--radius', getBorderRadiusValue(borderRadius));
  }, [theme, color, borderRadius]);

  const setThemeSettings = (settings: Partial<ThemeSettings>) => {
    const newSettings: ThemeSettings = {
      theme: settings.theme || theme,
      color: settings.color || color,
      opacity: settings.opacity !== undefined ? settings.opacity : opacity,
      borderRadius: settings.borderRadius || borderRadius,
    };

    if (settings.theme) setTheme(settings.theme);
    if (settings.color) setColor(settings.color);
    if (settings.opacity !== undefined) setOpacity(settings.opacity);
    if (settings.borderRadius) setBorderRadius(settings.borderRadius);

    localStorage.setItem(storageKey, JSON.stringify(newSettings));
  };

  const handleSetTheme = (newTheme: Theme) => {
    setThemeSettings({ theme: newTheme });
  };

  const handleSetColor = (newColor: ThemeColor) => {
    setThemeSettings({ color: newColor });
  };

  const handleSetOpacity = (newOpacity: ThemeOpacity) => {
    setThemeSettings({ opacity: newOpacity });
  };

  const handleSetBorderRadius = (newRadius: string) => {
    setThemeSettings({ borderRadius: newRadius });
  };

  const value = {
    theme,
    color,
    opacity,
    borderRadius,
    setTheme: handleSetTheme,
    setColor: handleSetColor,
    setOpacity: handleSetOpacity,
    setBorderRadius: handleSetBorderRadius,
    setThemeSettings,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

// Helper function to get CSS value for border radius
function getBorderRadiusValue(radius: string): string {
  switch (radius) {
    case 'none':
      return '0';
    case 'sm':
      return '0.125rem';
    case 'md':
      return '0.375rem';
    case 'lg':
      return '0.5rem';
    case 'full':
      return '9999px';
    default:
      return '0.375rem';
  }
}
