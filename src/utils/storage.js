// utils/storage.js
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// Simplified storage path structure
const bookfaceMediaStorage = {
  // User profile
  users: {
    profile: (userId) => `users/${userId}/profile/avatar.jpg`,
  },

  // Posts
  posts: {
    media: (userId, postId, fileName) => `posts/${userId}/${postId}/${fileName}`,
  },

  // Stories (24h content)
  stories: {
    media: (userId, storyId, fileName) => `stories/${userId}/${storyId}/${fileName}`,
  },

  // Direct messages
  messages: {
    attachments: (chatId, messageId, fileName) => 
      `messages/${chatId}/${messageId}/${fileName}`,
  },

  // Groups
  groups: {
    avatar: (groupId) => `groups/${groupId}/avatar.jpg`,
    cover: (groupId) => `users/${groupId}/profile/cover.jpg`,
    media: (groupId, fileName) => `groups/${groupId}/media/${fileName}`,
  }
};

// Upload functions
export const bookfaceMediaUpload = {
  // Upload profile picture
  async profilePicture(userId, imageFile) {
    try {
      const path = bookfaceMediaStorage.users.profile(userId);
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(snapshot.ref);
      
      return { success: true, url, path };
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return { success: false, error: error.message };
    }
  },

  // Upload post content
  async postMedia(userId, postId, file) {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const path = bookfaceMediaStorage.posts.media(userId, postId, fileName);
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      return { success: true, url, path };
    } catch (error) {
      console.error('Error uploading post media:', error);
      return { success: false, error: error.message };
    }
  },

  // Upload story
  async story(userId, storyId, file) {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const path = bookfaceMediaStorage.stories.media(userId, storyId, fileName);
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      return { success: true, url, path };
    } catch (error) {
      console.error('Error uploading story:', error);
      return { success: false, error: error.message };
    }
  },

  // Upload message attachment
  async messageAttachment(chatId, messageId, file) {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const path = bookfaceMediaStorage.messages.attachments(chatId, messageId, fileName);
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      return { success: true, url, path };
    } catch (error) {
      console.error('Error uploading message attachment:', error);
      return { success: false, error: error.message };
    }
  }
};

// Add these deletion functions to bookfaceMediaUpload

export const bookfaceMediaDelete = {
    // Delete profile picture
    async profilePicture(userId) {
      try {
        const path = bookfaceMediaStorage.users.profile(userId);
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        return { success: true };
      } catch (error) {
        console.error('Error deleting profile picture:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Delete post media
    async postMedia(path) {
      try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        return { success: true };
      } catch (error) {
        console.error('Error deleting post media:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Delete story
    async story(path) {
      try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        return { success: true };
      } catch (error) {
        console.error('Error deleting story:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Delete message attachment
    async messageAttachment(path) {
      try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        return { success: true };
      } catch (error) {
        console.error('Error deleting message attachment:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Delete multiple files
    async multipleFiles(paths) {
      try {
        const deletePromises = paths.map(path => {
          const storageRef = ref(storage, path);
          return deleteObject(storageRef);
        });
        
        await Promise.all(deletePromises);
        return { success: true };
      } catch (error) {
        console.error('Error deleting multiple files:', error);
        return { success: false, error: error.message };
      }
    }
  };