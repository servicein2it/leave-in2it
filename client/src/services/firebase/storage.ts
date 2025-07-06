import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './config';

export const storageService = {
  uploadProfileImage: async (file: File, userId: string): Promise<string> => {
    if (!isFirebaseConfigured || !storage) {
      throw new Error('Firebase Storage is not configured');
    }

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-${userId}-${timestamp}.${fileExtension}`;
      
      // Create storage reference
      const storageRef = ref(storage, `profile-images/${fileName}`);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new Error('Failed to upload profile image');
    }
  },

  deleteProfileImage: async (imageUrl: string): Promise<void> => {
    if (!isFirebaseConfigured || !storage) {
      return; // Silently fail if Firebase is not configured
    }

    try {
      // Extract the file path from the URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/profile-images%2F([^?]+)/);
      
      if (pathMatch) {
        const fileName = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, `profile-images/${fileName}`);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error('Error deleting profile image:', error);
      // Don't throw error for deletion failures
    }
  }
};

// Mock storage service for when Firebase is not configured
export const mockStorageService = {
  uploadProfileImage: async (file: File, userId: string): Promise<string> => {
    // Create a mock URL using FileReader for preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // In production, this would be a real Firebase URL
        // For now, return the data URL for preview
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  },

  deleteProfileImage: async (imageUrl: string): Promise<void> => {
    // Mock deletion - no action needed
    return Promise.resolve();
  }
};

// Export the appropriate service based on Firebase configuration
export const imageUploadService = isFirebaseConfigured ? storageService : mockStorageService;