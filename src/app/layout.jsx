import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "@/context/AuthContextProvider";

export const metadata = {
  title: "Bookface",
  description: "KCAU Social Media app",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
