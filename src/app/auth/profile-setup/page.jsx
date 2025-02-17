"use client";

import BioSection from "@/components/BioSection";
import InterestsSection from "@/components/InterestsSection";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContextProvider";
import { useRouter } from "next/navigation";

const ProfileSetupPage = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // Redirect to login page if user is not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  const handleSelectionChange = (interests, valid) => {
    setSelectedInterests(interests);
    setIsValid(valid);
    setError(""); // Clear error when selection changes
  };

  const handleSubmit = async () => {
    if (!isValid) {
      setError("Please choose at least 5 interests before proceeding.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate a loading state (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push("/");
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-4">
      <div className="max-w-xl w-full p-6 bg-white rounded-lg drop-shadow-md">
        <h1 className="text-3xl font-bold md:text-4xl">Profile Setup</h1>
        <hr className="my-4 border-gray-300" />
        <ProfilePictureUpload />
        <hr className="my-4 border-gray-300" />
        <BioSection />
        <hr className="my-4 border-gray-300" />
        <InterestsSection onSelectionChange={handleSelectionChange} />
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
      <button
        className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-full mt-4 md:w-1/2 lg:w-1/3 xl:w-1/4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Finish setting up"}
      </button>
    </div>
  );
};

export default ProfileSetupPage;
