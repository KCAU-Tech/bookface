"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContextProvider";
import { useRouter } from "next/navigation";
import "../app/globals.css";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user || !user.emailVerified) {
    return null;
  }

  return children;
}
