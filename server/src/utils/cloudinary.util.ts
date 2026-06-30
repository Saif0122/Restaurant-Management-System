import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';

// Configure Cloudinary
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (result) {
          resolve(result);
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const folderParts = parts.slice(parts.findIndex((p) => p === 'upload') + 2, -1);
    const fileNameWithoutExtension = lastPart.split('.')[0];

    if (folderParts.length > 0) {
      return `${folderParts.join('/')}/${fileNameWithoutExtension}`;
    }
    return fileNameWithoutExtension;
  } catch (error) {
    return null;
  }
};
