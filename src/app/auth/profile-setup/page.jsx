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
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // Redirect to login page if user is not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSelectionChange = (interests, valid) => {
    setSelectedInterests(interests);
    setIsValid(valid);
  };

  const handleSubmit = async () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-4">
      <div className="max-w-xl w-full p-6 bg-white rounded-lg drop-shadow-md">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">
          Profile Setup
        </h1>
        <hr className="my-4 border-gray-300" />
        <ProfilePictureUpload />
        <hr className="my-4 border-gray-300" />
        <BioSection />
        <hr className="my-4 border-gray-300" />
        <InterestsSection onSelectionChange={handleSelectionChange} />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4 md:w-1/2 lg:w-1/3 xl:w-1/4"
        onClick={handleSubmit}
        disabled={!isValid}
      >
        Finish setting up
      </button>
    </div>
  );
};

export default ProfileSetupPage;
