import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";

import useAuthStore from "../../../store/authStore";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      await googleLogin(credentialResponse.credential);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Campus <span className="text-blue-500">Diaries</span>
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Connect with your campus, join communities, and share your journey.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Login Failed")}
            theme="filled_black"
            shape="pill"
            text="continue_with"
            width="300"
          />
        </div>

        {loading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-300">
            <Loader2 size={18} className="animate-spin" />
            Signing in...
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
