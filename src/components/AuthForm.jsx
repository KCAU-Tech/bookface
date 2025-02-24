"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContextProvider";
import { courses } from "@/utils/kcauCourses";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { getDocument, setDocument } from "@/utils/firestore";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[0-9]{7}@students\.kcau\.ac\.ke$/,
      "Only KCAU student emails are allowed (format: admission-number@students.kcau.ac.ke)"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

const authSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[0-9]{7}@students\.kcau\.ac\.ke$/,
      "Only KCAU student emails are allowed (format: admission-number@students.kcau.ac.ke)"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  course: z
    .string()
    .nonempty("Please select a course")
    .refine((val) => courses.includes(val), {
      message: "Please select a valid course",
    }),
});

const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[0-9]{7}@students\.kcau\.ac\.ke$/,
      "Only KCAU student emails are allowed (format: admission-number@students.kcau.ac.ke)"
    ),
});

const AuthForm = () => {
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(
      isForgotPassword
        ? resetPasswordSchema
        : isLogin
          ? loginSchema
          : authSchema
    ),
    mode: "onSubmit",
  });

  const courseInputValue = watch("course");
  const filteredCourses = courses.filter((course) =>
    course.toLowerCase().includes((courseInputValue || "").toLowerCase())
  );

  const handleForgotPassword = async (data) => {
    setError(null);
    setResetSuccess(false);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, data.email);
      setResetSuccess(true);
      setIsLoading(false);
      reset();
    } catch (error) {
      console.error("Password reset error:", error);
      setIsLoading(false);
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
    }
  };

  const onSubmit = async (data) => {
    if (isForgotPassword) {
      await handleForgotPassword(data);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;
        if (!user.emailVerified) {
          setIsLoading(false);
          router.push("/auth/verify-email");
        } else if (user.emailVerified) {
          setIsLoading(false);
          const userDoc = await getDocument("users", user.uid);
          if (userDoc.data.profileSetup) {
            router.push("/");
          } else {
            router.push("/auth/profile-setup");
          }
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        await setDocument("users", userCredential.user.uid, {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username.toLowerCase(),
          course: data.course,
          profileSetup: false,
        });
        await sendEmailVerification(userCredential.user);
        setIsLoading(false);
        router.push("/auth/verify-email");
      }
      reset();
    } catch (error) {
      console.error("Auth error:", error);
      setIsLoading(false);
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
    }
  };

  const switchForm = (formType) => {
    setError(null);
    setResetSuccess(false);
    reset();

    if (formType === "login") {
      setIsLogin(true);
      setIsForgotPassword(false);
    } else if (formType === "signup") {
      setIsLogin(false);
      setIsForgotPassword(false);
    } else if (formType === "forgot") {
      setIsForgotPassword(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isForgotPassword
          ? "Reset Password"
          : isLogin
            ? "Login"
            : "Join Bookface"}
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {resetSuccess && (
        <p className="text-green-500 mb-2">
          Password reset email sent! Check your inbox.
        </p>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit((data) => {
            onSubmit(data);
          })(e);
        }}
        className="flex flex-col gap-4 w-80"
      >
        {!isLogin && !isForgotPassword && (
          <>
            <div>
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName")}
                className={`p-2 border rounded w-full ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                className={`p-2 border rounded w-full ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                {...register("username")}
                className={`p-2 border rounded w-full ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search your course"
                {...register("course")}
                className={`p-2 border rounded w-full ${
                  errors.course ? "border-red-500" : "border-gray-300"
                }`}
                onFocus={() => setShowCourseSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowCourseSuggestions(false), 200)
                }
                autoComplete="off"
              />
              {showCourseSuggestions && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
                  {filteredCourses.length === 0 ? (
                    <div className="p-2 text-gray-500">No courses found</div>
                  ) : (
                    filteredCourses.map((course) => (
                      <div
                        key={course}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setValue("course", course);
                          setShowCourseSuggestions(false);
                        }}
                      >
                        {course}
                      </div>
                    ))
                  )}
                </div>
              )}
              {errors.course && (
                <p className="text-red-500 text-sm">{errors.course.message}</p>
              )}
            </div>
          </>
        )}

        <div>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className={`p-2 border rounded w-full ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {!isForgotPassword && (
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              {...register("password")}
              className={`p-2 border rounded w-full ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white p-2 rounded hover:bg-primary-light transition-colors disabled:bg-gray-400"
        >
          {isLoading
            ? "Loading..."
            : isForgotPassword
              ? "Send Reset Link"
              : isLogin
                ? "Login"
                : "Sign up"}
        </button>
      </form>

      <div className="flex flex-col items-center gap-2 mt-4">
        {isForgotPassword ? (
          <button
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={() => switchForm("login")}
          >
            Back to Login
          </button>
        ) : (
          <>
            <button
              className="text-blue-600 hover:text-blue-800 underline"
              onClick={() => switchForm(isLogin ? "signup" : "login")}
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Login"}
            </button>

            {isLogin && (
              <button
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={() => switchForm("forgot")}
              >
                Forgotten password?
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
