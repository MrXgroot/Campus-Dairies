import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2, Sparkles, Users, MessageCircle } from "lucide-react";

import AnimatedBackground from "./AnimatedBackground";
import FloatingCards from "./FloatingCards";
import useAuthStore from "../../store/authStore";

const Feature = ({ icon: Icon, title, text }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 rounded-xl bg-white/10 p-2">
      <Icon size={18} className="text-blue-400" />
    </div>

    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-400">{text}</p>
    </div>
  </div>
);

const LoginPage = () => {
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      await googleLogin(credentialResponse.credential);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1020] text-white lg:h-screen">
      <AnimatedBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:h-full lg:py-0">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* LEFT */}

          <div className="flex h-full flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 backdrop-blur">
              <Sparkles size={16} />
              Campus Community Platform
            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight lg:text-7xl">
              Campus
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Diaries
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              Discover communities, join discussions, share unforgettable campus
              memories, and connect with students who think just like you.
            </p>

            <div className="mt-10 space-y-5">
              <Feature
                icon={Users}
                title="Student Communities"
                text="Join clubs, departments and interest groups across your campus."
              />

              <Feature
                icon={MessageCircle}
                title="Meaningful Discussions"
                text="Ask questions, help others and stay connected with your classmates."
              />

              <Feature
                icon={Sparkles}
                title="Share Moments"
                text="Photos, events, achievements and memories that stay forever."
              />
            </div>

            {/* Push cards to bottom on desktop */}
            <div className="mt-10 lg:mt-auto">
              <FloatingCards />
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl">
                <div className="text-center">
                  <h2 className="text-3xl font-bold">Welcome Back</h2>

                  <p className="mt-3 text-gray-400">
                    Continue with Google to access your communities.
                  </p>
                </div>

                <div className="mt-10 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log("Login Failed")}
                    theme="filled_black"
                    shape="pill"
                    text="continue_with"
                    width="320"
                  />
                </div>

                {loading && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-gray-300">
                    <Loader2 size={18} className="animate-spin" />
                    Signing you in...
                  </div>
                )}

                <div className="mt-10 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-center gap-8 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-400">
                        15K+
                      </div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>

                    <div>
                      <div className="text-xl font-bold text-cyan-400">
                        850+
                      </div>
                      <div className="text-xs text-gray-500">Communities</div>
                    </div>

                    <div>
                      <div className="text-xl font-bold text-purple-400">
                        52K+
                      </div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                By continuing you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
