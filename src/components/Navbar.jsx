"use client";

import { useState, useEffect } from "react";
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
import { getDocument } from "@/utils/firestore";

const exa = Lexend_Exa({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const navbarLogoStyle = `${exa.className} text-white select-none text-2xl`;

const ProfileImage = ({ userData, userEmail }) => {
  return userData?.photoURL?.url ? (
    <Image
      src={userData.photoURL.url}
      alt="Profile"
      width={40}
      height={40}
      className="object-cover"
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qQEE4OD5BPjIuMT5HR0pLS0pHR0dHR0dHR0dHR0f/2wBDARAVFhgYFhsYGBsnISAhJ00nJycnTU1HR0dHR01HR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-primary">
      {userEmail?.[0]?.toUpperCase() || "U"}
    </div>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const pathname = usePathname();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);

  const userEmail = user?.email;

  useEffect(() => {
    if (user) {
      const getUserDocument = async (user) => {
        try {
          const result = await getDocument("users", user.uid);
          setUserData(result.data);
        } catch (error) {
          console.error("Error fetching function:", error);
        }
      };

      getUserDocument(user);
    }
  }, [user]);

  const isActiveRoute = (route) => pathname === route;

  return (
    <nav className="bg-primary p-4 shadow-md text-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section - Logo */}
        <Link
          href="/"
          className={navbarLogoStyle}
          onClick={() => setIsOpen(false)}
          prefetch={false}
        >
          Bookface
        </Link>

        {user && user.emailVerified && (
          <>
            {/* Middle Section - Navigation Icons */}
            <div className="hidden md:flex items-center justify-center space-x-8">
              <Link
                href="/"
                prefetch={true}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isActiveRoute("/")
                    ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                    : "text-white hover:bg-primary-dark"
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
                prefetch={true}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isActiveRoute("/friends")
                    ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                    : "text-white hover:bg-primary-dark"
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
                prefetch={true}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isActiveRoute("/groups")
                    ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                    : "text-white hover:bg-primary-dark"
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
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isActiveRoute("/events")
                    ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                    : "text-white hover:bg-primary-dark"
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
                prefetch={true}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isActiveRoute("/marketplace")
                    ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                    : "text-white hover:bg-primary-dark"
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
                      <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                          {notificationCount}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
              <Link
                className="w-10 h-10 rounded-full overflow-hidden bg-gray-300"
                href="/profile"
                prefetch={true}
              >
                <ProfileImage userData={userData} userEmail={userEmail} />
              </Link>
            </div>
          </>
        )}
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
            {user && user.emailVerified && (
              <>
                <Link
                  href="/"
                  className={`p-2 rounded-lg flex items-center space-x-3 ${
                    isActiveRoute("/")
                      ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                      : "text-white hover:bg-primary-dark"
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
                  className={`p-2 rounded-lg flex items-center space-x-3 ${
                    isActiveRoute("/friends")
                      ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                      : "text-white hover:bg-primary-dark"
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
                  className={`p-2 rounded-lg flex items-center space-x-3 ${
                    isActiveRoute("/groups")
                      ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                      : "text-white hover:bg-primary-dark"
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
                  className={`p-2 rounded-lg flex items-center space-x-3 ${
                    isActiveRoute("/events")
                      ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                      : "text-white hover:bg-primary-dark"
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
                  className={`p-2 rounded-lg flex items-center space-x-3 ${
                    isActiveRoute("/marketplace")
                      ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                      : "text-white hover:bg-primary-dark"
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
              </>
            )}
            <div className="border-t border-gray-600 my-2"></div>
            {user && user.emailVerified && (
              <Link
                href="/notifications"
                className={`p-2 rounded-lg flex items-center space-x-3 ${
                  isActiveRoute("/notifications")
                    ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                    : "text-white hover:bg-primary-dark"
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
            )}
            {user && user.emailVerified && (
              <Link
                href="/profile"
                className={`p-2 rounded-lg flex items-center space-x-3 ${
                  isActiveRoute("/profile")
                    ? "text-secondary hover:text-secondary hover:bg-primary-dark"
                    : "text-white hover:bg-primary-dark"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <CgProfile size={24} />
                <span>Profile</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
