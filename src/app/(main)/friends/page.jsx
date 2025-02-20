"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

const FriendsPage = () => {
  return (
    <ProtectedRoute>
      <div>All your Friends and Friend Suggestions will appear here.</div>
    </ProtectedRoute>
  );
};

export default FriendsPage;
