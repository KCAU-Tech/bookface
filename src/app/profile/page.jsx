import ProtectedRoute from "@/hoc/ProtectedRoutes";
import React from "react";

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <div>Profile Pagesss</div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
