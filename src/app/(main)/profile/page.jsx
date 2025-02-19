"use client";

import React from "react";
import { useAuth } from "@/context/AuthContextProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  return (
    <ProtectedRoute>
      {user ? (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded m-2"
          onClick={logout}
        >
          Logout
        </button>
      ) : (
        <></>
      )}
    </ProtectedRoute>
  );
};

export default ProfilePage;
