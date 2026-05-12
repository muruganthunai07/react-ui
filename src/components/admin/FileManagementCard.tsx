import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileUpload } from '@/components/FileUpload';
import { useFileUpload } from '@/hooks/useFileUpload';
import { getFileUrl } from '@/lib/utils';
import type { FileType, FileUse } from '@/types/api';

interface FileManagementCardProps {
  title: string;
  description: string;
  fileType: FileType;
  fileUse: FileUse;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover';
  uploadText?: string;
}

export const FileManagementCard: React.FC<FileManagementCardProps> = ({
  title,
  description,
  fileType,
  fileUse,
  aspectRatio = 'aspect-square',
  objectFit = 'contain',
  uploadText = 'Upload File',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const {
    uploadFile,
    loadFiles,
    deleteFile,
    uploadedFiles,
    isUploading,
    isLoading,
  } = useFileUpload({
    fileType,
    fileUse,
  });

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleFileSelect = async (file: File) => {
    try {
      await uploadFile(file);
    } catch (error) {
      console.error('FileManagementCard - Upload error:', error);
      // Error is handled by the hook
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFile(id);
      if (currentIndex >= uploadedFiles.length - 1) {
        setCurrentIndex(Math.max(0, uploadedFiles.length - 2));
      }
    } catch (error) {
      console.error('FileManagementCard - Delete error:', error);
      // Error is handled by the hook
    }
  };

  const nextFile = () => {
    setCurrentIndex((prev) => (prev + 1) % uploadedFiles.length);
  };

  const prevFile = () => {
    setCurrentIndex((prev) => (prev - 1 + uploadedFiles.length) % uploadedFiles.length);
  };

  const currentFile = uploadedFiles[currentIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`relative w-full ${aspectRatio} max-w-sm mx-auto bg-muted rounded-lg overflow-hidden`}>
            {currentFile ? (
              <>
                <img
                  src={getFileUrl(currentFile.filePath)}
                  alt={currentFile.fileName}
                  className={`w-full h-full object-${objectFit}`}
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(currentFile.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {uploadedFiles.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                      onClick={prevFile}
                      disabled={isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={nextFile}
                      disabled={isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p>{isLoading ? 'Loading...' : 'No files uploaded.'}</p>
              </div>
            )}
          </div>

          <FileUpload
            id={`${title.toLowerCase().replace(/\s+/g, '-')}-upload`}
            onFileSelect={handleFileSelect}
            accept="image/*"
            disabled={isLoading}
            loading={isUploading}
          >
            {uploadText}
          </FileUpload>
        </div>
      </CardContent>
    </Card>
  );
}; 