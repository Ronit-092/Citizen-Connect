import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import Logo from "@/components/Logo";

export default function CitizenSignup() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (formData.fullName.trim().length < 3) {
      toast.error("Full name must be at least 3 characters");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!formData.username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (formData.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    // Username validation (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter a password");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim().toLowerCase(),
        password: formData.password,
        role: "citizen",
      });
      toast.success("Account created successfully!");
      // Use window.location for hard navigation
      window.location.href = "/citizen-dashboard";
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
        <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border-2 border-cyan-400/30 rounded-2xl p-8 w-full shadow-2xl shadow-cyan-500/10">
          {/* Glowing Top Border */}
          <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          {/* Header */}
          <div className="text-center mb-8">
            <Logo className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-1">Create Account</h1>
            <p className="text-xs text-gray-400 tracking-widest uppercase">
              Join Our Community
            </p>
          </div>

          {/* Error Message */}
          {loading && (
            <div className="mb-6 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
              ⟳ Creating your account...
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="text-xs text-cyan-400 mb-2 block font-semibold tracking-widest">
                ▐ NAME
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                autoComplete="off"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                required
                disabled={loading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="text-xs text-cyan-400 mb-2 block font-semibold tracking-widest">
                ▐ EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="citizen@network.io"
                autoComplete="off"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                required
                disabled={loading}
              />
            </div>

            {/* Username Input */}
            <div>
              <label className="text-xs text-cyan-400 mb-2 block font-semibold tracking-widest">
                ▐ USERNAME
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium pr-12"
                  required
                  disabled={loading}
                  minLength={6}
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

            {/* Confirm Password Input */}
            <div>
              <label className="text-xs text-cyan-400 mb-2 block font-semibold tracking-widest">
                ▐ CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium pr-12"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-400 hover:text-white transition-colors">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 rounded bg-white/10 border border-white/20 accent-cyan-400"
                disabled={loading}
              />
              <span>
                ACCEPT{" "}
                <a
                  href="#"
                  className="text-cyan-400 hover:text-emerald-400 transition-colors font-semibold"
                >
                  TERMS
                </a>{" "}
                AND{" "}
                <a
                  href="#"
                  className="text-cyan-400 hover:text-emerald-400 transition-colors font-semibold"
                >
                  PRIVACY
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold text-sm hover:shadow-2xl hover:shadow-cyan-400/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest mt-6"
            >
              {loading ? "⟳ CREATING..." : "▶ SIGNUP"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-6 text-xs">
            ALREADY REGISTERED?{" "}
            <Link
              to="/citizen-login"
              className="text-cyan-400 hover:text-emerald-400 transition-colors font-bold"
            >
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
