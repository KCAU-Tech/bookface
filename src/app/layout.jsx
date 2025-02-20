import "./globals.css";
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lexend.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
