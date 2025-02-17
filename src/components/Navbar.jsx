"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContextProvider";
import { Lexend_Exa } from "next/font/google";

const navbarLogoStyle = `${exa.className} text-white select-none text-2xl`;
const exa = Lexend_Exa({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const userEmail = user?.email;
  const studentId = userEmail?.split("@")[0];

  return (
    <nav className="bg-primary p-4 shadow-md text-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={navbarLogoStyle}>
          Bookface
        </Link>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <button
          className="hidden bg-red-500 text-white p-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-[#1e2a50] p-4 space-y-2">
          <li>
            <Link
              href="/"
              className="block text-white py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block text-white py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block text-white py-2"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </li>
          {user && (
            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </ul>
      )}
    </nav>
  );
}
