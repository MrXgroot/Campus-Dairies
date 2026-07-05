import React, { useState, useRef, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import useAuthStore from "../store/authStore";

const dateStamp = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const LoginPage = () => {
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const [isLoading, setIsLoading] = useState(false);
  const [btnWidth, setBtnWidth] = useState(320);
  const cardRef = useRef(null);

  // Keep the Google button pixel-matched to the card width so it never
  // looks off-center, on any screen size.
  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const update = () => setBtnWidth(Math.min(el.offsetWidth - 64, 320));
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#10131F] text-[#F3ECDD] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-mono-stamp { font-family: 'IBM Plex Mono', monospace; }

        @keyframes drift {
          0%, 100% { transform: translateY(0) translateX(0); opacity: .35; }
          50% { transform: translateY(-14px) translateX(6px); opacity: .9; }
        }
        .firefly { animation: drift 6s ease-in-out infinite; }

        .ruled-paper {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 31px,
            rgba(243, 236, 221, 0.07) 32px
          );
        }
        .margin-rule {
          position: relative;
        }
        .margin-rule::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 64px;
          width: 1px;
          background: rgba(217, 123, 123, 0.35);
        }
        @media (max-width: 1023px) {
          .margin-rule::before { left: 28px; }
        }
      `}</style>

      {/* Left: brand / journal panel */}
      <div className="relative flex-1 lg:flex-[1.15] ruled-paper margin-rule px-8 sm:px-14 lg:px-20 py-14 lg:py-0 flex flex-col justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
        <span className="firefly absolute w-1.5 h-1.5 rounded-full bg-[#E3A857]" style={{ top: "20%", left: "72%", animationDelay: "0s" }} />
        <span className="firefly absolute w-1 h-1 rounded-full bg-[#E3A857]" style={{ top: "62%", left: "84%", animationDelay: "1.4s" }} />
        <span className="firefly absolute w-1.5 h-1.5 rounded-full bg-[#E3A857]" style={{ top: "78%", left: "60%", animationDelay: "2.8s" }} />
        <span className="firefly absolute w-1 h-1 rounded-full bg-[#E3A857]" style={{ top: "38%", left: "90%", animationDelay: "4s" }} />

        <p className="font-mono-stamp text-[11px] tracking-[0.25em] uppercase text-[#9098C2] mb-5 pl-2">
          {dateStamp()} — Entry No. 001
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] pl-2 font-semibold">
          Campus
          <br />
          Diaries
        </h1>
        <p className="font-display italic mt-6 max-w-sm text-[#9098C2] text-base leading-relaxed pl-2">
          "Every quad has a story. Every 2am walk, a footnote."
        </p>
        <p className="mt-8 text-sm text-[#6b7094] pl-2">
          Dive into campus stories &amp; moments.
        </p>
      </div>

      {/* Right: login panel */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-16 bg-[#0B0E1A]">
        <div
          ref={cardRef}
          className="relative w-full max-w-[360px] bg-[#F3ECDD] text-[#10131F] rounded-sm shadow-2xl px-8 py-10"
        >
          {/* folded corner */}
          <div
            className="absolute top-0 right-0 w-6 h-6 bg-black/10"
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
          />

          <p className="font-mono-stamp text-[10px] tracking-[0.2em] uppercase text-[#9098C2] mb-2">
            Sign in
          </p>
          <h2 className="font-display text-2xl mb-8 font-semibold">
            Pick up your pen.
          </h2>

          <div className="flex flex-col items-center gap-5">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Login Failed")}
                theme="filled_black"
                shape="pill"
                text="continue_with"
                width={btnWidth}
              />
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-[#5a5f7a]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing you in...</span>
              </div>
            )}
          </div>

          <p className="mt-10 text-xs text-[#8b8fa8] leading-relaxed">
            By continuing, you agree to jot only true stories (mostly).
          </p>
        </div>

        <footer className="absolute bottom-6 text-xs text-[#4a4f6a]">
          © 2025 CampusDiaries. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
