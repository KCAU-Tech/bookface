import ProtectedRoute from "@/hoc/ProtectedRoutes";
import React from "react";

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <div>Profile Page</div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
