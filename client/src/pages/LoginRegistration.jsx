import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import useAuthStore from "../store/authStore";

const LoginPage = () => {
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const googleToken = credentialResponse.credential;
      await googleLogin(googleToken);
    } catch (err) {
      console.error("Google login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6">
      {/* Branding */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          CampusDairies
        </div>
        <p className="mt-2 text-gray-400 text-sm">
          Dive into campus stories & moments
        </p>
      </div>

      {/* Google Login */}
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Login Failed")}
              theme="filled_black"
              shape="pill"
              text="continue_with"
            />
          </div>

          {isLoading && (
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing you in...</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-gray-500 text-center">
        © 2025 CampusDiaries. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
