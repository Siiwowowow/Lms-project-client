import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";
import SocialLogin from "../SocialLogin/SocialLogin";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Signup = () => {
  const { createUser, uploadProfile, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const axiosInstance = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(false);
  
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  // Handle signup
  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Create account in Firebase
      const result = await createUser(data.email, data.password);
      
      // Update profile with name
      await uploadProfile({
        displayName: `${data.firstName} ${data.lastName}`,
      });

      // Update user context
      setUser(result.user);

      // Prepare user data for backend
      const userInfo = {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: 'user',
        photoURL: result.user.photoURL || null,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      // Post user data to backend
      const backendResponse = await axiosInstance.post('/users', userInfo);
      
      console.log('User data saved to backend:', backendResponse.data);

      Swal.fire({
        title: "Success!",
        text: "Your account has been created successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      navigate(from, { replace: true });

    } catch (err) {
      console.error("Signup error:", err);
      
      // Handle different error types
      let errorMessage = "Signup failed. Please try again.";
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address. Please check your email format.";
      } else if (err.response?.data?.error) {
        // Backend API error
        errorMessage = `Account created but data saving failed: ${err.response.data.error}`;
      }
      
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md border border-gray-300 rounded-2xl p-4 shadow space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-black">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign up for a new account
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-600"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName", { required: "First name required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-600"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName", { required: "Last name required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
                      message: "Password must contain at least 1 special character",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register("agreeToTerms", {
                  required: "You must accept terms",
                })}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                disabled={isLoading}
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 text-sm text-gray-600"
              >
                I agree to the{" "}
                <a href="#" className="text-cyan-600 hover:text-cyan-500">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-md font-semibold transition-all duration-300 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 mx-12">
              <SocialLogin />
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-cyan-600 hover:text-cyan-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;