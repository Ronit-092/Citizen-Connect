import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import Logo from "@/components/Logo";

export default function CitizenLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await login({ email: email.trim(), password });
      
      if (result) {
        toast.success("Login successful!");
        // Use window.location for hard navigation to ensure state is fresh
        window.location.href = "/citizen-dashboard";
      }
    } catch (err) {
      // Error is already handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="w-full max-w-sm relative z-10 px-0">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-emerald-400 transition-colors mb-6 text-sm font-semibold tracking-widest uppercase"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          ◄ HOME
        </Link>

        {/* Card */}
        <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border-2 border-cyan-400/30 rounded-2xl p-6 sm:p-8 w-full shadow-2xl shadow-cyan-500/10">
          {/* Glowing Top Border */}
          <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center font-bold text-base sm:text-lg text-black mx-auto mb-3 sm:mb-4">
              <Zap className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">Citizen Portal</h1>
            <p className="text-xs sm:text-sm text-gray-400 tracking-widest uppercase">
              Report & Track Issues
            </p>
          </div>

          {/* Error Message */}
          {loading && (
            <div className="mb-6 p-3 sm:p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm">
              ⟳ Authenticating...
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* Email Input */}
            <div>
              <label className="text-xs text-cyan-400 mb-2 block font-semibold tracking-widest">
                ▐ EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@network.io"
                autoComplete="off"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs text-cyan-400 mb-2 block font-semibold tracking-widest">
                ▐ PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium pr-12"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  className="rounded bg-white/10 border border-white/20 accent-cyan-400"
                  disabled={loading}
                />
                <span>REMEMBER IDENTITY</span>
              </label>
              <a
                href="#"
                className="text-emerald-400 hover:text-cyan-400 transition-colors font-semibold tracking-widest"
              >
                RESET KEY?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold text-sm hover:shadow-2xl hover:shadow-cyan-400/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {loading ? "⟳ LOGGING IN..." : "▶ LOGIN"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-gray-400 mt-8 text-xs">
            NO ACCOUNT?{" "}
            <Link
              to="/citizen-signup"
              className="text-cyan-400 hover:text-emerald-400 transition-colors font-bold"
            >
              CREATE ONE
            </Link>
          </p>

          {/* Government Login Link */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-center text-xs text-gray-400 mb-4 tracking-widest uppercase">
              AUTHORIZED PERSONNEL?
            </p>
            <Link
              to="/govt-login"
              className="block w-full py-2 rounded-lg border border-emerald-400/30 text-emerald-400 text-center font-semibold hover:bg-emerald-400/10 transition-all text-xs uppercase tracking-widest"
            >
              ▶ ADMIN ACCESS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
