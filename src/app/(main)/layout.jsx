import "../globals.css";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContextProvider";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Bookface",
  description: "KCAU Social Media app",
};

export default function MainLayout({ children }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Navbar />
        {children}
      </ProtectedRoute>
    </AuthProvider>
  );
}
