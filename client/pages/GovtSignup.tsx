import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/Logo";

export default function GovtSignup() {
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
    department: "",
  });
  
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.fullName || !formData.email || !formData.username || !formData.password || !formData.department) {
      const msg = "Please fill in all fields";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (formData.password.length < 6) {
      const msg = "Password must be at least 6 characters";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: "government",
        department: formData.department,
      });
      
      toast.success("Government account created successfully!");
      navigate("/govt-dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signup failed. Please try again.";
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

      <div className="w-full max-w-md relative z-10 px-0">
        {/* Back Link */}
        <Link
          to="/govt-login"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-cyan-400 transition-colors mb-6 text-sm font-semibold tracking-widest uppercase"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          ◄ BACK TO LOGIN
        </Link>

        {/* Card */}
        <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border-2 border-emerald-400/30 rounded-2xl p-6 sm:p-8 w-full shadow-2xl shadow-emerald-500/10">
          {/* Glowing Top Border */}
          <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-lg text-black mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Create Admin Account</h1>
            <p className="text-sm text-gray-400 tracking-widest uppercase">
              Government Portal Registration
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 text-sm">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="text-xs text-emerald-400 mb-2 block font-semibold tracking-widest">
                ▐ FULL NAME
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                required
                disabled={loading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="text-xs text-emerald-400 mb-2 block font-semibold tracking-widest">
                ▐ EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@authority.gov"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                required
                disabled={loading}
              />
            </div>

            {/* Username Input */}
            <div>
              <label className="text-xs text-emerald-400 mb-2 block font-semibold tracking-widest">
                ▐ USERNAME
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="admin_user"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                required
                disabled={loading}
                minLength={3}
                maxLength={30}
              />
            </div>

            {/* Department Select */}
            <div>
              <label className="text-xs text-emerald-400 mb-2 block font-semibold tracking-widest">
                ▐ DEPARTMENT
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                required
                disabled={loading}
              >
                <option value="" className="bg-[#1a0a42]">Select Department</option>
                <option value="admin" className="bg-[#1a0a42]">Admin</option>
                <option value="road" className="bg-[#1a0a42]">Road & Infrastructure</option>
                <option value="water" className="bg-[#1a0a42]">Water & Sanitation</option>
                <option value="utilities" className="bg-[#1a0a42]">Utilities</option>
                <option value="health" className="bg-[#1a0a42]">Health & Safety</option>
              </select>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs text-emerald-400 mb-2 block font-semibold tracking-widest">
                ▐ PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors"
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
              <label className="text-xs text-emerald-400 mb-2 block font-semibold tracking-widest">
                ▐ CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border-2 border-cyan-400/30 text-cyan-300 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-900/70 transition-all text-sm font-medium"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold tracking-widest uppercase transition-all hover:shadow-xl hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-6"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account?</span>{" "}
            <Link
              to="/govt-login"
              className="text-cyan-400 hover:text-emerald-400 font-semibold tracking-widest transition-colors"
            >
              LOGIN HERE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
