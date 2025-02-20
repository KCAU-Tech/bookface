"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, reload } from "firebase/auth";
import { useRouter } from "next/navigation";

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
            // Only redirect to home if we're on the auth page
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/auth')) {
              router.push("/");
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
        if (!currentPath.startsWith('/auth')) {
          router.push("/auth");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
