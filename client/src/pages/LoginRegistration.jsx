import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import useAuthStore from "../store/authStore";

// Reusable Flame Icon Component (Derived from premium logo)
const CampfireLogoIcon = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Simplified representation of the multi-tone orange gradient flame */}
    <defs>
      <linearGradient id="premiumOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9F43" /> {/* Top/Tip */}
        <stop offset="50%" stopColor="#FF6B1A" />
        <stop offset="100%" stopColor="#C0392B" /> {/* Bottom/Deep */}
      </linearGradient>
    </defs>
    <path
      d="M50 5C50 5 80 35 80 65C80 85 65 100 50 100C35 100 20 85 20 65C20 35 50 5Z"
      fill="url(#premiumOrangeGradient)"
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
    <div className="min-h-screen flex bg-neutral-950 font-serif text-white">
      {/* Intentional asymmetrical layout: Logo/Focus area (Left), Interaction (Right) */}
      <div className="flex-1 flex flex-col justify-center items-center px-12 md:px-24">
        {/* Subtly textured background with focused lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1A1A1A_0%,_#0D0D0D_100%)] opacity-80" />

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
          {/* Integrated Premium Logo */}
          <div className="flex flex-col items-center mb-16 space-y-6">
            <CampfireLogoIcon className="w-20 h-20 shadow-2xl shadow-neutral-900" />
            <div className="text-5xl font-light text-center tracking-wide">
              CAMP
              <span className="text-[#FF6B1A] font-medium">FIRE</span>
            </div>
            <p className="text-neutral-500 text-sm italic tracking-tight max-w-sm text-center">
              The premium hub for campus stories. Intentional connection.
            </p>
          </div>

          {/* Minimalist Google Login Container */}
          <div className="w-full bg-neutral-900 p-10 rounded-2xl border border-neutral-800 shadow-xl flex flex-col items-center space-y-8">
            <div className="w-full text-center">
              <span className="text-sm text-neutral-400">Continue with...</span>
            </div>

            <div className="w-full max-w-xs transition-opacity hover:opacity-90">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Login Failed")}
                theme="filled_black" // Neutral theme
                shape="pill"
                size="large" // Make it more prominent/clickable
                text="continue_with"
                ux_mode="popup"
              />
            </div>

            {isLoading && (
              <div className="flex items-center space-x-3 text-sm text-[#FF6B1A] pt-4 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authorizing Your Presence...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative, premium right-side panel (Optional, adds imbalance intentionally) */}
      <div className="hidden lg:flex w-2/5 bg-[#121212] flex-col justify-center items-center border-l border-neutral-800 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#262626_0%,_#121212_100%)]" />
        <CampfireLogoIcon className="w-96 h-96 opacity-10 blur-xl scale-125" />
      </div>
    </div>
  );
};

export default LoginPage;
