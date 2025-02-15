"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContextProvider";
import { reload } from "firebase/auth";

const VerifyEmailPage = () => {
  const { user, logout } = useAuth();
  const [emailVerified, setEmailVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        await reload(auth.currentUser); // Refresh user object
        if (auth.currentUser.emailVerified) {
          setEmailVerified(true);
          clearInterval(interval);
          router.push("/auth/profile-setup"); // Redirect to profile setup
        }
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
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
  );
};

export default VerifyEmailPage;
