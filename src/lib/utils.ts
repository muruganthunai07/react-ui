import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add number formatting function
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Constructs the full file URL from the base URL and file path.
 * If the given filePath is already a valid URL, returns it as is.
 * Otherwise, combines it with the base URL.
 * @param filePath - The file path or URL from the API response
 * @returns The complete file URL
 */
export function getFileUrl(filePath: string): string | undefined {
  try {
    // Try to construct a URL; if successful and protocol is http/https, return it
    const url = new URL(filePath);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return filePath;
    }
  } catch  {
    console.error('Error constructing file URL:', filePath);
    // Fallback to combining base URL and file path
    const baseUrl = import.meta.env.VITE_BASE_URL || '';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanFilePath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    return `${cleanBaseUrl}${cleanFilePath}`;
  }
}

// Convert 24-hour time strings (e.g., "14:30" or "14:30:00") to 12-hour format with AM/PM
export const formatTimeTo12Hour = (time24: string): string => {
  if (!time24) return '';
  const parts = time24.split(':');
  const hourNum = parseInt(parts[0], 10);
  if (Number.isNaN(hourNum)) return time24;
  const minutes = (parts[1] ?? '00').padStart(2, '0');
  const seconds = parts[2] !== undefined ? parts[2].padStart(2, '0') : undefined;
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  let hour12 = hourNum % 12;
  if (hour12 === 0) hour12 = 12;
  return seconds !== undefined ? `${hour12}:${minutes}:${seconds} ${ampm}` : `${hour12}:${minutes} ${ampm}`;
};

export const getWhatsAppHelpUrl = (
  rawHelpNumber?: string,
  message: string = 'I need help on Games'
): string | null => {
  if (!rawHelpNumber) return null;

  const whatsappNumber = rawHelpNumber.replace(/\D/g, '');
  if (!whatsappNumber) return null;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
};

export const openWhatsAppHelp = (
  rawHelpNumber?: string,
  message: string = 'I need help on Games'
): boolean => {
  const whatsappUrl = getWhatsAppHelpUrl(rawHelpNumber, message);
  if (!whatsappUrl) return false;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  return true;
};