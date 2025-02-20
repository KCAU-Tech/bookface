export const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-credential":
        return "Invalid email or password. Please check and try again.";
      case "auth/user-not-found":
        return "No account found with this email. Please sign up or check your email.";
      case "auth/wrong-password":
        return "Incorrect password. Try again or reset your password.";
      case "auth/user-disabled":
        return "This account has been disabled. Contact support for help.";
      case "auth/unverified-email":
        return "Please verify your email before logging in. Check your inbox.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Try again later or reset your password.";
      case "auth/invalid-email":
        return "Invalid email format. Please enter a valid email address.";
      case "auth/weak-password":
        return "Your password is too weak. Use at least 6 characters with a mix of letters and numbers.";
      case "auth/email-already-in-use":
        return "An account with this email already exists. Try logging in instead.";
      case "auth/operation-not-allowed":
        return "This sign-in method is disabled. Contact support for help.";
      default:
        return "An unknown error occurred. Please try again.";
    }
  };
  