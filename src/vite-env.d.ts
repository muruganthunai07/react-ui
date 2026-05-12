/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_SHORT_NAME?: string;
  readonly VITE_USER_COOKIE_NAME?: string;
  readonly VITE_APK_URL?: string;
  readonly VITE_APK_FILE_NAME?: string;
  /** When omitted or not "false", referral UI is shown. Set to "false" to disable. */
  readonly VITE_REFERRAL_SUPPORTED?: string;
  /**
   * Default accent when the user has no saved theme preference.
   * One of: default, red, rose, orange, green, blue, yellow, violet, pink, indigo, cyan, emerald.
   * Omit or invalid value → yellow.
   */
  readonly VITE_DEFAULT_THEME_COLOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
