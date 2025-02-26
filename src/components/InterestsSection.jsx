import React, { useState, useEffect } from "react";
import { interests } from "../utils/studentInterests";

const InterestsSection = ({ onSelectionChange }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((i) => i !== interest));
    } else if (selectedInterests.length < 10) {
      setSelectedInterests((prev) => [...prev, interest]);
    }
  };

  useEffect(() => {
    const isValid =
      selectedInterests.length >= 5 && selectedInterests.length <= 10;
    onSelectionChange(selectedInterests, isValid);
  }, [selectedInterests, onSelectionChange]);

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Select Your Interests</h3>
      <p className="text-sm text-gray-500">
        Choose at least 5 interests (max 10).
      </p>

      <div className="flex flex-wrap gap-2">
        {Array.isArray(interests) &&
          interests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 
              ${
                selectedInterests.includes(interest)
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              } 
              ${
                selectedInterests.length >= 10 &&
                !selectedInterests.includes(interest)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {interest}
            </button>
          ))}
      </div>
    </div>
  );
};

export default InterestsSection;
