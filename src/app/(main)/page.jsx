"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContextProvider";
import { getDocument } from "@/utils/firestore";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import NewsFeed from "@/components/NewsFeed";
import RightSidebar from "@/components/RightSidebar";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    const getUserDocument = async (userCredential) => {
      try {
        setIsLoading(true);
        const result = await getDocument("users", userCredential.uid);
      } catch (error) {
        console.error("Error fetching function:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserDocument(user);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar - Sticky */}
      <div className="hidden md:block md:w-1/4 lg:w-1/5 bg-white shadow sticky top-0 h-screen overflow-y-auto">
        <div className="p-4">
          <Sidebar />
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 px-2 py-4 md:px-6 overflow-y-auto">
        <NewsFeed />
      </div>

      {/* Right Sidebar - Sticky */}
      <div className="hidden lg:block lg:w-1/4 sticky top-0 h-screen overflow-y-auto">
        <div className="p-4">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
