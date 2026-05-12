import React, { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  showPreview?: boolean;
  previewUrl?: string;
  onRemove?: () => void;
  id?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
  loading = false,
  className,
  children,
  showPreview = false,
  previewUrl,
  onRemove,
  id = 'file-upload',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate unique ID if not provided
  const uniqueId = id || `file-upload-${Math.random().toString(36).substr(2, 9)}`;

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    // Check file type
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return fileType === type;
      });

      if (!isValidType) {
        return `File type not supported. Accepted types: ${accept}`;
      }
    }

    return null;
  }, [accept, maxSize]);

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect, uniqueId]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !loading) {
      setIsDragOver(true);
    }
  }, [disabled, loading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled || loading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, loading, handleFileSelect]);

  return (
    <div className={cn('space-y-4', className)}>
      {showPreview && previewUrl && (
        <div className="relative w-full aspect-square max-w-sm mx-auto bg-muted rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          {onRemove && (
            <div className="absolute top-2 right-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={onRemove}
                disabled={disabled || loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          'flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          isDragOver 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground/25 hover:bg-muted/50',
          (disabled || loading) && 'cursor-not-allowed opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor={uniqueId} className="flex items-center cursor-pointer">
          <Upload className="h-5 w-5 mr-2" />
          <span>
            {loading 
              ? 'Uploading...' 
              : children || 'Upload File (Drag & Drop)'
            }
          </span>
          <Input
            id={uniqueId}
            type="file"
            className="sr-only"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
            disabled={disabled || loading}
          />
        </label>
      </div>

      {error && (
        <div className="text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}; 