// utils/formatters.js

/**
 * Format timestamp to a relative time string
 * @param {any} timestamp - Timestamp in various formats
 * @returns {string} - Formatted relative time string
 */
export const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
  
    let date;
  
    // Check if timestamp is a Firestore timestamp (has toDate method)
    if (timestamp && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    }
    // Check if timestamp is a Date object
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Check if timestamp is a number (milliseconds)
    else if (typeof timestamp === "number") {
      date = new Date(timestamp);
    }
    // Check if timestamp is a string (ISO format)
    else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    }
    // If we couldn't parse the timestamp, return default
    else {
      return "Just now";
    }
  
    const seconds = Math.floor((new Date() - date) / 1000);
  
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
    return date.toLocaleDateString();
  };