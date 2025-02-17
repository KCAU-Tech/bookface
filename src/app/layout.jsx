import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "@/context/AuthContextProvider";
import { Open_Sans, Lexend } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Bookface",
  description: "KCAU Social Media app",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={lexend.className}>
          <Navbar />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
