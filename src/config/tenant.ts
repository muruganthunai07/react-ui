import {
  isValidThemeColor,
  type ThemeColor,
} from '@/lib/theme-colors';

const getEnvValue = (value: string | undefined, fallback: string): string => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

export const TENANT_APP_NAME = getEnvValue(
  import.meta.env.VITE_APP_NAME,
  ''
);

export const TENANT_SHORT_NAME = getEnvValue(
  import.meta.env.VITE_APP_SHORT_NAME,
   ''
);

export const TENANT_USER_COOKIE_NAME = getEnvValue(
  import.meta.env.VITE_USER_COOKIE_NAME,
   ''
);

export const TENANT_APK_URL = import.meta.env.VITE_APK_URL?.trim() || '';

export const TENANT_APK_FILE_NAME = getEnvValue(
  import.meta.env.VITE_APK_FILE_NAME,
  ''
);

const parseReferralSupported = (value: string | undefined): boolean => {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed) return true;
  return trimmed !== 'false' && trimmed !== '0';
};

export const TENANT_REFERRAL_SUPPORTED = parseReferralSupported(
  import.meta.env.VITE_REFERRAL_SUPPORTED
);

const parseTenantDefaultThemeColor = (
  value: string | undefined
): ThemeColor => {
  const raw = value?.trim().toLowerCase();
  if (!raw) return 'yellow';
  if (isValidThemeColor(raw)) return raw;
  return 'yellow';
};

export const TENANT_DEFAULT_THEME_COLOR = parseTenantDefaultThemeColor(
  import.meta.env.VITE_DEFAULT_THEME_COLOR
);
