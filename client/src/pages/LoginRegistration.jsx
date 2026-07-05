import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import useAuthStore from "../store/authStore";

// The premium, single-element abstract flame icon from your dashboard brand
const PremiumFlameIcon = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="premiumOrange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF8F3d" />
        <stop offset="100%" stopColor="#D34A00" />
      </linearGradient>
    </defs>
    <path
      d="M50 5C50 5 78 36 78 64C78 82 65 95 50 95C35 95 22 82 22 64C22 36 50 5Z"
      fill="url(#premiumOrange)"
    />
  </svg>
);

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
    <div className="min-h-screen flex bg-[#0D0D0D] text-neutral-200 antialiased relative overflow-hidden">
      {/* Subtle architectural grid/light texture matching the premium dashboard */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#141414_0%,_#0D0D0D_100%)]" />

      {/* Main Container - Balanced & Intentional Spacing */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-sm flex flex-col items-center">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <PremiumFlameIcon className="w-14 h-14" />
            
            <h1 className="text-3xl font-light tracking-wide text-white font-sans">
              Campus<span className="text-[#FF6B1A] font-semibold">Dairies</span>
            </h1>
            
            <p className="text-sm text-neutral-500 max-w-xs tracking-tight">
              Dive into campus stories & moments. An intentional creative space.
            </p>
          </div>

          {/* Minimalist Action Box */}
          <div className="w-full bg-[#141414] border border-neutral-800/60 p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-6">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Login Failed")}
                theme="filled_black" 
                shape="pill"
                size="large"
                text="continue_with"
              />
            </div>

            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-[#FF6B1A] animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Connecting securely...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clean, minimalist footer placeholder */}
      <footer className="absolute bottom-6 left-0 right-0 text-center text-xs text-neutral-600 tracking-wider font-mono">
        © 2026 CAMPUSDAIRIES. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default LoginPage;
