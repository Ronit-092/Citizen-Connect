import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/Logo";

export default function GovtLogin() {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      const msg = "Please fill in all fields";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      const result = await login({ email, password });
      // Check if user is government role
      if (result.user.role !== "government") {
        const msg = "Only government officials can access this portal";
        setError(msg);
        toast.error(msg);
        return;
      }
      toast.success("Government login successful! Redirecting...");
      navigate("/govt-dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="w-full max-w-sm relative z-10 px-0">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-cyan-400 transition-colors mb-6 text-sm font-semibold tracking-widest uppercase"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          ◄ HOME
        </Link>

        {/* Card */}
        <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border-2 border-emerald-400/30 rounded-2xl p-6 sm:p-8 w-full shadow-2xl shadow-emerald-500/10">
          {/* Glowing Top Border */}
          <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-base sm:text-lg text-black mx-auto mb-3 sm:mb-4">
              <Shield className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">Admin Portal</h1>
            <p className="text-xs sm:text-sm text-gray-400 tracking-widest uppercase">
              Manage & Resolve Issues
            </p>
          </div>

          {(error || authError) && (
            <div className="mb-6 p-3 sm:p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs sm:text-sm">
              ⚠ {error || authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* Department Email Input */}
            <div>
              <label className="text-xs text-emerald-400 mb-2 block font-semibold tracking-widest">
                ▐ EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                autoComplete="off"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                required
                disabled={loading}        
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs text-emerald-400 mb-2 block font-semibold tracking-widest">
                ▐ PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
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
                  className="rounded bg-white/10 border border-white/20 accent-emerald-400"
                  disabled={loading}
                />
                <span>REMEMBER SESSION</span>
              </label>
              <a
                href="#"
                className="text-cyan-400 hover:text-emerald-400 transition-colors font-semibold tracking-widest"
              >
                RESET CODE?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold text-sm hover:shadow-2xl hover:shadow-emerald-400/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {loading ? "⟳ LOGGING IN..." : "▶ LOGIN"}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Need an account?</span>{" "}
            <Link
              to="/govt-signup"
              className="text-cyan-400 hover:text-emerald-400 font-semibold tracking-widest transition-colors"
            >
              SIGN UP
            </Link>
          </div>

          {/* Citizen Login Link */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-center text-xs text-gray-400 mb-4 tracking-widest uppercase">
              REGULAR USER?
            </p>
            <Link
              to="/citizen-login"
              className="block w-full py-2 rounded-lg border border-cyan-400/30 text-cyan-400 text-center font-semibold hover:bg-cyan-400/10 transition-all text-xs uppercase tracking-widest"
            >
              ▶ CITIZEN ACCESS
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 rounded-lg bg-orange-500/10 border border-orange-400/30">
            <p className="text-xs text-orange-300 font-semibold">
              🔒 SECURE NETWORK DETECTED | AUTHORIZED PERSONNEL ONLY
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
