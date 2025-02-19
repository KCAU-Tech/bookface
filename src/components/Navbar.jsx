"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Users, Calendar, ShoppingBag, Bell } from "lucide-react";
import { MdGroups } from "react-icons/md";
import { GoHomeFill, GoHome } from "react-icons/go";
import { BsPeopleFill, BsPeople } from "react-icons/bs";
import { HiUserGroup, HiOutlineUserGroup } from "react-icons/hi";
import { IoCalendarNumberOutline, IoCalendarNumber } from "react-icons/io5";
import { RiShoppingBasket2Line, RiShoppingBasket2Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "@/context/AuthContextProvider";
import { Lexend_Exa } from "next/font/google";
import Image from "next/image";

const exa = Lexend_Exa({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const navbarLogoStyle = `${exa.className} text-white select-none text-2xl`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);

  const userEmail = user?.email;
  const studentId = userEmail?.split("@")[0];

  const handleLogOut = async () => {
    await logout();
    setIsOpen(false);
  };

  const isActiveRoute = (route) => pathname === route;

  return (
    <nav className="bg-primary p-4 shadow-md text-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section - Logo */}
        <Link href="/" className={navbarLogoStyle} onClick={() => setIsOpen(false)}>
          Bookface
        </Link>

        {/* Middle Section - Navigation Icons */}
        <div className="hidden md:flex items-center justify-center space-x-8">
          <Link
            href="/"
            className={`text-white p-2 rounded-lg transition-colors duration-200 ${
              isActiveRoute("/")
                ? "text-secondary hover:bg-primary-dark"
                : "hover:bg-primary-dark"
            }`}
          >
            {isActiveRoute("/") ? (
              <GoHomeFill size={30} />
            ) : (
              <GoHome size={30} />
            )}
          </Link>
          <Link
            href="/friends"
            className={`text-white p-2 rounded-lg transition-colors duration-200 ${
              isActiveRoute("/friends")
                ? "text-secondary hover:bg-primary-dark"
                : "hover:bg-primary-dark"
            }`}
          >
            {isActiveRoute("/friends") ? (
              <BsPeopleFill size={30} />
            ) : (
              <BsPeople size={30} />
            )}
          </Link>
          <Link
            href="/groups"
            className={`text-white p-2 rounded-lg transition-colors duration-200 ${
              isActiveRoute("/groups")
                ? "text-secondary hover:bg-primary-dark"
                : "hover:bg-primary-dark"
            }`}
          >
            {isActiveRoute("/groups") ? (
              <HiUserGroup size={30} />
            ) : (
              <HiOutlineUserGroup size={30} />
            )}
          </Link>
          <Link
            href="/events"
            className={`text-white p-2 rounded-lg transition-colors duration-200 ${
              isActiveRoute("/events")
                ? "text-secondary hover:bg-primary-dark"
                : "hover:bg-primary-dark"
            }`}
          >
            {isActiveRoute("/events") ? (
              <IoCalendarNumber size={30} />
            ) : (
              <IoCalendarNumberOutline size={30} />
            )}
          </Link>
          <Link
            href="/marketplace"
            className={`text-white p-2 rounded-lg transition-colors duration-200 ${
              isActiveRoute("/marketplace")
                ? "text-secondary hover:bg-primary-dark"
                : "hover:bg-primary-dark"
            }`}
          >
            {isActiveRoute("/marketplace") ? (
              <RiShoppingBasket2Fill size={30} />
            ) : (
              <RiShoppingBasket2Line size={30} />
            )}
          </Link>
        </div>

        {/* Right Section - Notifications and Profile */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <button className="text-white hover:bg-primary-dark p-2 rounded-lg">
              <Bell size={24} />
              {hasNotifications && (
                <>
                  {/* Notification dot */}
                  <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  {/* Optional: Notification counter */}
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                      {notificationCount}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary">
                {userEmail?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-white p-2 rounded-lg flex items-center space-x-3 ${
                isActiveRoute("/") ? "bg-secondary" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {isActiveRoute("/") ? (
                <GoHomeFill size={24} />
              ) : (
                <GoHome size={24} />
              )}
              <span>Home</span>
            </Link>
            <Link
              href="/friends"
              className={`text-white p-2 rounded-lg flex items-center space-x-3 ${
                isActiveRoute("/friends") ? "bg-secondary" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {isActiveRoute("/friends") ? (
                <BsPeopleFill size={24} />
              ) : (
                <BsPeople size={24} />
              )}
              <span>Friends</span>
            </Link>
            <Link
              href="/groups"
              className={`text-white p-2 rounded-lg flex items-center space-x-3 ${
                isActiveRoute("/groups") ? "bg-secondary" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {isActiveRoute("/groups") ? (
                <HiUserGroup size={24} />
              ) : (
                <HiOutlineUserGroup size={24} />
              )}
              <span>Groups</span>
            </Link>
            <Link
              href="/events"
              className={`text-white p-2 rounded-lg flex items-center space-x-3 ${
                isActiveRoute("/events") ? "bg-secondary" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {isActiveRoute("/events") ? (
                <IoCalendarNumber size={24} />
              ) : (
                <IoCalendarNumberOutline size={24} />
              )}
              <span>Events</span>
            </Link>
            <Link
              href="/marketplace"
              className={`text-white p-2 rounded-lg flex items-center space-x-3 ${
                isActiveRoute("/marketplace") ? "bg-secondary" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {isActiveRoute("/marketplace") ? (
                <RiShoppingBasket2Fill size={24} />
              ) : (
                <RiShoppingBasket2Line size={24} />
              )}
              <span>Marketplace</span>
            </Link>
            <div className="border-t border-gray-600 my-2"></div>
            <Link
              href="/notifications"
              className={`text-white p-2 rounded-lg flex items-center space-x-3 ${
                isActiveRoute("/notifications") ? "bg-secondary" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="relative">
                <Bell size={24} />
                {hasNotifications && (
                  <>
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                        {notificationCount}
                      </span>
                    )}
                  </>
                )}
              </div>
              <span>Notifications</span>
            </Link>
            <Link
              href="/profile"
              className={`text-white p-2 rounded-lg flex items-center space-x-3 ${
                isActiveRoute("/profile") ? "bg-secondary" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <CgProfile size={24} />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
