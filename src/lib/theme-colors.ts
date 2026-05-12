export const THEME_COLOR_OPTIONS = [
  'default',
  'red',
  'rose',
  'orange',
  'green',
  'blue',
  'yellow',
  'violet',
  'pink',
  'indigo',
  'cyan',
  'emerald',
] as const;

export type ThemeColor = (typeof THEME_COLOR_OPTIONS)[number];

export function isValidThemeColor(value: string): value is ThemeColor {
  return (THEME_COLOR_OPTIONS as readonly string[]).includes(value);
}
