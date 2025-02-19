"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContextProvider";

export default function Home() {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  const userEmail = user?.email;
  const studentId = userEmail?.split("@")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://us-central1-bookface-backend.cloudfunctions.net/helloWorld"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching function:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center m-4">
      <div className="bg-white p-12 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">Hello student {studentId}</h1>
        <h1 className="text-3xl">Welcome to Bookface</h1>
      </div>
    </div>
  );
}
