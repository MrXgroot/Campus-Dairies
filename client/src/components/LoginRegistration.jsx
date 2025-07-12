import React, { useState } from "react";
import { Mail, Lock, User, Upload, X, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import useAuthStore from "../store/authStore";
// Google Logo Component

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Mock auth store for demonstration
// const useAuthStore = {
//   isLoading: false,
//   login: async ({ email, password }) => {
//     console.log("Login:", { email, password });
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   },
//   register: async (formData) => {
//     console.log("Register:", formData);
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   },
//   googleLogin: async (googleToken) => {
//     console.log("Google Login:", googleToken);
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   },
// };

// AuthModal Component - Shared bottom drawer
const AuthModal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div
          className="px-6 pb-8 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 60px)" }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

// Login Component
const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login=useAuthStore(s=>s.login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
     login(formData);
      onClose();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button className="text-blue-400 hover:text-blue-300 transition-colors">
            Forgot Password?
          </button>
        </div>
      </div>
    </AuthModal>
  );
};

// Register Component
const Register = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const register = useAuthStore((s) => s.register);

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      if (formData.profileImage) {
        submitData.append("profileImage", formData.profileImage);
      }

      register(formData);
      onClose();
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join us today</p>
        </div>

        <div className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-3"></div>

          {/* Email Input */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            By creating an account, you agree to our{" "}
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </AuthModal>
  );
};

// Main App Component
const LoginRegistration = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const googleLogin=useAuthStore(s=>s.googleLogin);
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would integrate with Google OAuth
      // For now, we'll simulate the process
      const mockGoogleToken = "mock-google-token";
      googleLogin(mockGoogleToken);
      console.log("Google sign up successful");
    } catch (error) {
      console.error("Google sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="text-center space-y-6 max-w-md w-full">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-4">
              <User size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              RewindNest
            </h1>
          </div>

          {/* Welcome Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Welcome</h2>
            <p className="text-gray-400 text-lg">
              Connect with friends and discover amazing memories!!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-8">
            {/* Google Sign Up Button */}
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setIsLoading(true);
                  const googleToken = credentialResponse.credential;
                  console.log(googleToken);
                  await useAuthStore.getState().googleLogin(googleToken);
                  console.log("Google sign up successful");
                } catch (error) {
                  console.error("Google sign up error:", error);
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={() => {
                console.error("Google login failed");
              }}
              theme="filled_black"
              size="large"
              width="100%"
            />

            {/* Divider */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Create Account Button */}
            <button
              onClick={() => setShowRegister(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Already have an account section */}
      <div className="text-center py-6 border-t border-gray-800">
        <p className="text-gray-400 mb-2">Already have an account?</p>
        <button
          onClick={() => setShowLogin(true)}
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          Log In
        </button>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">
          © 2025 RewindNest. All rights reserved.
        </p>
      </div>

      {/* Modals */}
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />

      <Register isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  );
};

export default LoginRegistration;
