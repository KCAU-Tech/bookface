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
    <main className="h-full flex flex-col justify-between">
      <div>{children}</div>
      <footer className="text-center py-4">
        <p className="text-sm text-gray-600">
          Made with <span className="text-red-500 text-xl">❤️</span> by KCA
          University Tech Club
        </p>
      </footer>
    </main>
  );
};

export default AuthPageLayout;
