// app/auth/profile-setup/components/BioSection.js
import React, { useState } from "react";
import { forbiddenWords } from "../utils/forbiddenWords";

const BioSection = ({ bio, onBioChange }) => {
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const input = e.target.value;

    if (forbiddenWords.some((word) => input.toLowerCase().includes(word))) {
      setError("No bad words allowed");
    } else {
      setError(null);
      onBioChange(input);
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold">Bio Section</h3>
      <textarea
        className="w-full p-2 sm:p-3 border rounded-md h-24 sm:h-32"
        placeholder="Tell others about yourself..."
        maxLength={500}
        onChange={handleChange}
        value={bio}
      />
      {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
      <p className="text-xs sm:text-sm text-gray-500">Maximum 500 characters</p>
    </div>
  );
};

export default BioSection;
