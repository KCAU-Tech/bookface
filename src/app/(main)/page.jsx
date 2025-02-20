"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContextProvider";
import { getDocument } from "@/utils/firestore";
import { useRouter } from "next/navigation";

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const userEmail = user?.email;
  const studentId = userEmail?.split("@")[0];

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    const getUserDocument = async (userCredential) => {
      try {
        setIsLoading(true);
        const result = await getDocument("users", userCredential.uid);
        setData(result.data);
      } catch (error) {
        console.error("Error fetching function:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserDocument(user);
  }, [user]);

  return (
    <div className="flex items-center justify-center m-4">
      <div className="bg-white p-12 rounded-lg shadow-lg">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold">
              Hello {data?.firstName || ""}
            </h1>
            <h1 className="text-3xl">Welcome to Bookface</h1>
          </>
        )}
      </div>
    </div>
  );
}
