import API from './api';
import { FileType, FileUse } from '@/types/api';
import type { FileResponse } from '@/types/api';

export const FileService = {
  /**
   * Upload a file to the server
   * @param file - The file to upload
   * @param fileType - Type of file (Image, etc.)
   * @param fileUse - Purpose of the file (BannerImage, PaymentScreenshot, ProfilePicture)
   * @returns Promise with the uploaded file response
   */
  async uploadFile(file: File, fileType: FileType, fileUse: FileUse): Promise<FileResponse> {
   const formData = new FormData();
    formData.append('file', file);

    const requestConfig = {
      params: {
        fileType: Number(fileType),
        fileUse: Number(fileUse),
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await API.post('/api/game/File/files', formData, requestConfig);
    return response.data;
  },

  /**
   * Get a specific file by ID
   * @param id - File ID
   * @returns Promise with the file response
   */
  async getFile(id: number): Promise<FileResponse> {
    const response = await API.get(`/api/game/File/files/${id}`);
    return response.data;
  },

  /**
   * Delete a file by ID
   * @param id - File ID
   * @returns Promise with the deletion response
   */
  async deleteFile(id: number): Promise<void> {
    await API.delete(`/api/game/File/files/${id}`);
  },

  /**
   * Get all files by file use type
   * @param fileUse - Purpose of the files to retrieve
   * @returns Promise with array of file responses
   */
  async getFilesByUse(fileUse: FileUse): Promise<FileResponse[]> {
    const response = await API.get(`/api/game/File/files/use/${fileUse}`);
    return response.data;
  },

  /**
   * Upload a banner image
   * @param file - The banner image file
   * @returns Promise with the uploaded file response
   */
  async uploadBanner(file: File): Promise<FileResponse> {
    return this.uploadFile(file, FileType.Image, FileUse.BannerImage);
  },

  /**
   * Upload a QR code image
   * @param file - The QR code image file
   * @returns Promise with the uploaded file response
   */
  async uploadQrCode(file: File): Promise<FileResponse> {
    // Using PaymentScreenshot for QR codes as they are typically used for payment verification
    return this.uploadFile(file, FileType.Image, FileUse.QRCode);
  },

  /**
   * Get all banner images
   * @returns Promise with array of banner file responses
   */
  async getBanners(): Promise<FileResponse[]> {
    return this.getFilesByUse(FileUse.BannerImage);
  },

  /**
   * Get all QR code images
   * @returns Promise with array of QR code file responses
   */
  async getQrCodes(): Promise<FileResponse[]> {
    return this.getFilesByUse(FileUse.QRCode);
  },

  /**
   * Delete a banner image
   * @param id - Banner file ID
   * @returns Promise with the deletion response
   */
  async deleteBanner(id: number): Promise<void> {
    return this.deleteFile(id);
  },

  /**
   * Delete a QR code image
   * @param id - QR code file ID
   * @returns Promise with the deletion response
   */
  async deleteQrCode(id: number): Promise<void> {
    return this.deleteFile(id);
  },
}; 