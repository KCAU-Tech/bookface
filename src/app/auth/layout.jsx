import "../globals.css";
import { AuthProvider } from "@/context/AuthContextProvider";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Bookface Auth",
  description: "Join Bookface today!",
};

const AuthPageLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={lexend.className}>
        <main className="min-h-screen flex flex-col">
          {/* Navbar is removed for the auth page */}
          {children}
          <footer className="text-center py-4 bg-gray-200 mt-auto">
            <p className="text-sm text-gray-600">
              Made with <span className="text-red-500 text-xl">❤️</span> by KCAU
              University Tech Club
            </p>
          </footer>
        </main>
      </body>
    </html>
  );
};

export default AuthPageLayout;
