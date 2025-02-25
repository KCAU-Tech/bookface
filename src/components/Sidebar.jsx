"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContextProvider";
import { getDocument } from "@/utils/firestore";
import Image from "next/image";
import { GoHomeFill, GoHome } from "react-icons/go";
import { BsPeopleFill, BsPeople } from "react-icons/bs";
import { HiUserGroup, HiOutlineUserGroup } from "react-icons/hi";
import { IoCalendarNumberOutline, IoCalendarNumber } from "react-icons/io5";
import { RiShoppingBasket2Line, RiShoppingBasket2Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

const Sidebar = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      const getUserDocument = async (user) => {
        try {
          const result = await getDocument("users", user.uid);
          setUserData(result.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      getUserDocument(user);
    }
  }, [user]);

  const isActiveRoute = (route) => pathname === route;

  const navItems = [
    {
      href: "/",
      name: "Home",
      activeIcon: <GoHomeFill size={24} />,
      inactiveIcon: <GoHome size={24} />,
    },
    {
      href: "/friends",
      name: "Friends",
      activeIcon: <BsPeopleFill size={24} />,
      inactiveIcon: <BsPeople size={24} />,
    },
    {
      href: "/groups",
      name: "Groups",
      activeIcon: <HiUserGroup size={24} />,
      inactiveIcon: <HiOutlineUserGroup size={24} />,
    },
    {
      href: "/events",
      name: "Events",
      activeIcon: <IoCalendarNumber size={24} />,
      inactiveIcon: <IoCalendarNumberOutline size={24} />,
    },
    {
      href: "/marketplace",
      name: "Marketplace",
      activeIcon: <RiShoppingBasket2Fill size={24} />,
      inactiveIcon: <RiShoppingBasket2Line size={24} />,
    },
    {
      href: "/profile",
      name: "Profile",
      activeIcon: <CgProfile size={24} className="text-secondary" />,
      inactiveIcon: <CgProfile size={24} />,
    },
  ];

  const ProfileImage = () => {
    return userData?.photoURL ? (
      <Image
        src={userData.photoURL}
        alt="Profile"
        width={36}
        height={36}
        className="rounded-full object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-primary">
        {userData?.firstName?.[0]?.toUpperCase() || "U"}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto scrollbar-hide">
      {/* User profile section */}
      {userData && (
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg mb-2"
        >
          <ProfileImage />
          <div className="font-medium">
            {userData.firstName} {userData.lastName}
          </div>
        </Link>
      )}

      {/* Navigation links */}
      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isActiveRoute(item.href)
                    ? "bg-gray-200 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="text-primary">
                  {isActiveRoute(item.href)
                    ? item.activeIcon
                    : item.inactiveIcon}
                </span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 p-3 text-xs text-gray-500 border-t bg-white">
        {/* <p>Privacy · Terms · Advertising · Ad Choices</p> */}
        <p>Bookface {new Date().getFullYear()}</p>
        <p className="mt-1">Made with ❤️ by KCA University Tech Club</p>
      </div>
    </div>
  );
};

export default Sidebar;
