"use client";

import BioSection from "@/components/BioSection";
import InterestsSection from "@/components/InterestsSection";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContextProvider";
import { useRouter } from "next/navigation";
import { updateDocument } from "@/utils/firestore";
import "../../globals.css";

const ProfileSetupPage = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [bio, setBio] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const handleBioChange = (newBio) => {
    setBio(newBio);
  };

  const handleSelectionChange = (interests, valid) => {
    setSelectedInterests(interests);
    setIsValid(valid);
    setError("");
  };

  const handleSubmit = async () => {
    if (!isValid) {
      setError("Please choose at least 5 interests before proceeding.");
      return;
    }

    if (!user?.uid) {
      setError("User not authenticated");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await updateDocument("users", user.uid, {
        bio: bio,
        interests: selectedInterests,
        profileSetup: true,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update profile");
      }

      await router.replace("/");
    } catch (error) {
      console.error("Profile setup error:", error);
      setError(error.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-t-4 border-b-4 border-primary rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">
              Setting up your account
            </h2>
            <p className="text-gray-500">
              Please wait while we save your profile...
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-4">
        <div className="max-w-xl w-full p-6 bg-white rounded-lg drop-shadow-md">
          <h1 className="text-3xl font-bold md:text-4xl">Profile Setup</h1>
          <hr className="my-4 border-gray-300" />
          <ProfilePictureUpload />
          <hr className="my-4 border-gray-300" />
          <BioSection bio={bio} onBioChange={handleBioChange} />
          <hr className="my-4 border-gray-300" />
          <InterestsSection onSelectionChange={handleSelectionChange} />
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
        <button
          className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-full mt-4 md:w-1/2 lg:w-1/3 xl:w-1/4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
        >
          Finish setting up
        </button>
      </div>
    </>
  );
};

export default ProfileSetupPage;
