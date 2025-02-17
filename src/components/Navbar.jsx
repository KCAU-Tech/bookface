"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContextProvider";
import { Lexend_Exa } from "next/font/google";

const exa = Lexend_Exa({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const navbarLogoStyle = `${exa.className} text-white select-none text-2xl`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const userEmail = user?.email;
  const studentId = userEmail?.split("@")[0];

  const handleLogOut = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-primary p-4 shadow-md text-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={navbarLogoStyle}>
          Bookface
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white">
            Home
          </Link>
          <Link href="/about" className="text-white">
            About
          </Link>
          <Link href="/contact" className="text-white">
            Contact
          </Link>
          {user && (
            <button
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              onClick={handleLogOut}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <ul className="bg-[#1e2a50] p-4 space-y-2 mt-2">
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
                href="/"
                className="block text-white py-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block text-white py-2"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </li>
            {user && (
              <li>
                <button
                  className="w-full text-left bg-red-500 text-white p-2 rounded"
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
