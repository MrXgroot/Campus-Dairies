import React, { useState, useRef, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import useAuthStore from "../store/authStore";

const LoginPage = () => {
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const [isLoading, setIsLoading] = useState(false);
  const [btnWidth, setBtnWidth] = useState(280);
  const btnWrapRef = useRef(null);

  useEffect(() => {
    if (!btnWrapRef.current) return;
    const el = btnWrapRef.current;
    const update = () => setBtnWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Centered, bounded content area so it never sprawls edge-to-edge */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-0 items-center">
          {/* Left: branding */}
          <div className="text-center lg:text-left lg:pr-16 animate-fade-in-up">
            <div className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              CampusDiaries
            </div>
            <p className="mt-3 text-gray-400 text-sm lg:text-base">
              Dive into campus stories &amp; moments
            </p>
          </div>

          {/* Right: login card, divider only spans this row's height */}
          <div className="flex justify-center lg:justify-start lg:pl-16 lg:border-l lg:border-white/10">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-10">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full flex justify-center" ref={btnWrapRef}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log("Login Failed")}
                    theme="filled_black"
                    shape="pill"
                    text="continue_with"
                    width={Math.min(btnWidth, 280)}
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pb-6 text-sm text-gray-500 text-center">
        © 2025 CampusDiaries. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
