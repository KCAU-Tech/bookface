"use client"

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://us-central1-bookface-backend.cloudfunctions.net/helloWorld");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching function:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>
      <h1>{data?.title || "Loading..."}</h1>
      <p>{data?.message}</p>
    </div>
  );
}
