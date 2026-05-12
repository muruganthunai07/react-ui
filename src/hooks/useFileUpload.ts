import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FileService } from '@/services/FileService';
import type { FileType, FileUse, FileResponse } from '@/types/api';

interface UseFileUploadOptions {
  fileType: FileType;
  fileUse: FileUse;
  onSuccess?: (file: FileResponse) => void;
  onError?: (error: Error) => void;
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { fileType, fileUse, onSuccess, onError } = options;
  const uploadFile = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      const uploadedFile = await FileService.uploadFile(file, fileType, fileUse);
      setUploadedFiles(prev => [...prev, uploadedFile]);
      onSuccess?.(uploadedFile);
      toast.success('File uploaded successfully!');
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      toast.error(errorMessage);
      onError?.(error as Error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [fileType, fileUse, onSuccess, onError]);

  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const files = await FileService.getFilesByUse(fileUse);
      setUploadedFiles(files);
      return files;
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fileUse]);

  const deleteFile = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      await FileService.deleteFile(id);
      setUploadedFiles(prev => prev.filter(file => file.id !== id));
      toast.info('File removed successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    uploadFile,
    loadFiles,
    deleteFile,
    clearFiles,
    uploadedFiles,
    isUploading,
    isLoading,
  };
};

// Specific hooks for common use cases
export const useBannerUpload = (onSuccess?: (file: FileResponse) => void) => {
  return useFileUpload({
    fileType: 0, // FileType.Image
    fileUse: 0,  // FileUse.BannerImage
    onSuccess,
  });
};

export const useQrCodeUpload = (onSuccess?: (file: FileResponse) => void) => {
  return useFileUpload({
    fileType: 0, // FileType.Image
    fileUse: 1,  // FileUse.PaymentScreenshot (for QR codes)
    onSuccess,
  });
}; 