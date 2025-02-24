import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { bookfaceMediaUpload, bookfaceMediaDelete } from "@/utils/storage";
import { useAuth } from "@/context/AuthContextProvider";
import { updateDocument, getDocument } from "@/utils/firestore";

const ProfilePictureUpload = () => {
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDocument("users", user.uid);
        setUserData(userDoc);

        if (userDoc?.data?.photoURL) {
          setPreview(userDoc.data.photoURL);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  const processImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve({
                blob,
                preview: canvas.toDataURL("image/webp", 0.8),
              });
            },
            "image/webp",
            0.8
          );
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        setProcessing(true);
        const { blob, preview } = await processImage(file);

        setPreview(preview);

        const existingPhotoURL = userData?.data?.photoURL;
        if (existingPhotoURL) {
          const path = bookfaceMediaStorage.users.profile(user.uid);
          if (existingPhotoURL.startsWith(path)) {
            await bookfaceMediaDelete.profilePicture(user.uid);
          }
        }

        const downloadURL = await bookfaceMediaUpload.profilePicture(
          user.uid,
          blob
        );

        const updatedUserData = await updateDocument("users", user.uid, {
          photoURL: downloadURL.url,
        });

        setUserData(updatedUserData);
      } catch (error) {
        console.error("Error processing image:", error);
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-2 sm:p-4 md:p-6">
      <div className="flex-1 items-start justify-start">
        <h3 className="text-base sm:text-lg font-semibold">Profile Picture</h3>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full bg-gray-100 overflow-hidden">
          {userData?.data?.photoURL ? (
            <img
              src={userData?.data?.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <Upload className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-gray-400" />
            </div>
          )}
          {processing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="profile-upload"
        />
        <label
          htmlFor="profile-upload"
          className="mt-2 px-2 py-1 bg-primary text-white rounded-md cursor-pointer hover:bg-primary-light font-medium text-xs md:text-sm lg:text-base"
        >
          {processing
            ? "Processing..."
            : userData?.data?.photoURL || preview
              ? "Change profile photo"
              : "Upload Photo"}
        </label>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
