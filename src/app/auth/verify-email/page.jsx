"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContextProvider";
import { reload } from "firebase/auth";

const VerifyEmailPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check verification status periodically
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const interval = setInterval(async () => {
      try {
        await reload(user);
        if (user.emailVerified) {
          clearInterval(interval);
          router.push("/auth/profile-setup");
        }
      } catch (error) {
        console.error("Error reloading user:", error);
      }
    }, 3000);

    setLoading(false);
    return () => clearInterval(interval);
  }, [user, router]);

  if (!user && loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] mx-4 sm:mx-0">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p>
          We have sent a verification email to <strong>{user?.email}</strong>.
        </p>
        <p>Please check your inbox and verify your email.</p>
        <p>Once verified, you will be redirected automatically.</p>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
