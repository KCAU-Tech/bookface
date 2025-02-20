import ProtectedRoute from "@/components/ProtectedRoute";

const EventsPage = () => {
  return (
    <ProtectedRoute>
      <div>KCAU Events will appear here.</div>
    </ProtectedRoute>
  );
};

export default EventsPage;
