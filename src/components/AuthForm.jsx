"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContextProvider";
import { courses } from "@/utils/kcauCourses";

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

const AuthForm = () => {
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: "",
      course: "",
    },
  });

  const courseInputValue = watch("course");
  const filteredCourses = courses.filter((course) =>
    course.toLowerCase().includes((courseInputValue || "").toLowerCase())
  );

  if (user) {
    router.push("/");
  }

  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        setIsLoading(false);
        router.push("/");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        await sendEmailVerification(userCredential.user);
        setIsLoading(false);
        router.push("/verify-email");
      }
      reset();
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isLogin ? "Login" : "Sign up"}
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80"
      >
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              className={`p-2 border rounded ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
            <input
              type="text"
              placeholder="Last Name"
              className={`p-2 border rounded ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
            <input
              type="text"
              placeholder="Username"
              className={`p-2 border rounded ${errors.username ? "border-red-500" : "border-gray-300"}`}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
            <div className="relative">
              <input
                type="text"
                placeholder="Search your course"
                className={`p-2 border rounded w-full ${
                  errors.course ? "border-red-500" : "border-gray-300"
                }`}
                {...register("course")}
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
            </div>
            {errors.course && (
              <p className="text-red-500 text-sm">{errors.course.message}</p>
            )}
          </>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className={`p-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Enter your password"
          className={`p-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          {isLoading ? "Loading..." : isLogin ? "Login" : "Sign up"}
        </button>
      </form>

      <button
        className="mt-4 text-blue-600 hover:text-blue-800 underline"
        onClick={toggleMode}
      >
        {isLogin
          ? "Need an account? Sign up"
          : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default AuthForm;
