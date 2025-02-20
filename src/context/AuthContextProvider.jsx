"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, reload } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getDocument } from "@/utils/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await reload(currentUser);
          setUser(currentUser);

          if (!currentUser.emailVerified) {
            router.push("/auth/verify-email");
          } else {
            // Check profile setup status in Firestore
            const userDoc = await getDocument("users", currentUser.uid);
            console.log(userDoc);
            const userData = userDoc?.data;
            const profileSetup = userData?.profileSetup;

            // Only redirect to home if we're on an auth page (except verify-email and profile-setup)
            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/auth")) {
              if (!profileSetup) {
                router.push("/auth/profile-setup");
              } else {
                router.push("/");
              }
            }
          }
        } catch (error) {
          console.error("Error reloading user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        // Redirect to auth page if not already there
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/auth")) {
          router.push("/auth");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    try {
      // First set loading to true to prevent any redirects from onAuthStateChanged
      setLoading(true);
      await signOut(auth);
      setUser(null);
      // Navigate after state is cleared
      router.replace("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
