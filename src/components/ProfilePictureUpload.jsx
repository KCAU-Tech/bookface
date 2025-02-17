import React, { useState } from "react";
import { Upload } from "lucide-react";

const ProfilePictureUpload = () => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-2 sm:p-4 md:p-6">
      <div className="flex-1 items-start justify-start">
        <h3 className="text-base sm:text-lg font-semibold">Profile Picture</h3>
      </div>
      <div className=" flex flex-1 flex-col items-center justify-center">
        <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full bg-gray-100 overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <Upload className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-gray-400" />
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
          Upload Photo
        </label>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
