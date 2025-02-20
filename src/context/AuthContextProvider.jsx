"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, reload } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getDocument } from "@/utils/firestore";

const AuthContext = createContext(null);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const getFirestoreData = async (userId, retryCount = 0) => {
    try {
      const userDoc = await getDocument("users", userId);
      return userDoc?.data;
    } catch (error) {
      console.error(`Firestore fetch attempt ${retryCount + 1} failed:`, error);
      if (retryCount < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return getFirestoreData(userId, retryCount + 1);
      }
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    const handleUserState = async (currentUser) => {
      if (!mounted) return;

      if (currentUser) {
        try {
          await reload(currentUser);
          setUser(currentUser);

          if (!currentUser.emailVerified) {
            router.push("/auth/verify-email");
            return;
          }

          // Get user data with retry mechanism
          const userData = await getFirestoreData(currentUser.uid);
          const profileSetup = userData?.profileSetup;

          const currentPath = window.location.pathname;
          if (currentPath.startsWith("/auth")) {
            if (!profileSetup) {
              router.push("/auth/profile-setup");
            } else {
              router.push("/");
            }
          }
        } catch (error) {
          console.error("Error in auth state handling:", error);
          setError(error);
          setUser(null);
        }
      } else {
        setUser(null);
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/auth")) {
          router.push("/auth");
        }
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, handleUserState);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      router.replace("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
