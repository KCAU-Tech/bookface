import React from "react";
import AuthForm from "@/components/AuthForm";
import { Lexend_Exa } from "next/font/google";

const lexendExa = Lexend_Exa({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const AuthenticationPage = () => {
  return (
    // Added flex and items-center to center the content vertically
    <div className="flex items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side with logo and tagline */}
        <div className="flex flex-col items-start md:items-start">
          <div className="text-primary text-6xl font-bold mb-4">
            <span className={lexendExa.className}>Bookface</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-normal text-secondary max-w-md">
            Bookface connects you with other KCAU students.
          </h2>
        </div>

        {/* Right side with auth form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white py-8 px-6 shadow-md rounded-lg">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
