import { useCallback } from 'react';
import { toast as sonnerToast } from 'sonner';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  title: string;
  description: string;
  variant?: ToastVariant;
}

// Create a proper useToast hook
export function useToast() {
  const toast = useCallback(
    ({ title, description, variant = 'default' }: ToastProps) => {
      if( variant === 'destructive' ){
      sonnerToast.error(title, {
        description,
      });}else{
        sonnerToast.info(title, {
          description,
        });
      }
    },
    []
  );

  return { toast };
}

// Also export a standalone toast function for convenience
export const toast = ({
  title,
  description,
  variant = 'default',
}: ToastProps) => {
  if( variant === 'destructive' ){
    sonnerToast.error(title, {
      description,
    });}else{
      sonnerToast.info(title, {
        description,
      });
    }
};
