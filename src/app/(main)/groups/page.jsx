import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

const GroupsPage = () => {
  return (
    <ProtectedRoute>
      <h3>Groups Page</h3>
    </ProtectedRoute>
  );
};

export default GroupsPage;
