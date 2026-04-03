import { useState } from "react";
import { X, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
}: LoginModalProps) {
  const navigate = useNavigate();

  const handleCitizenClick = () => {
    onClose();
    navigate("/citizen-login");
  };

  const handleGovtClick = () => {
    onClose();
    navigate("/govt-login");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border-2 border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-md animate-slide-up relative overflow-hidden">
        {/* Glowing top border */}
        <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Quick Access</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-cyan-400 hover:text-emerald-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-4">
          <p className="text-sm text-gray-300 text-center mb-6">
            Choose your portal to continue
          </p>
          
          {/* Citizen Portal Button */}
          <button
            onClick={handleCitizenClick}
            className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border-2 border-cyan-400/30 hover:border-cyan-400 text-white font-semibold text-sm hover:shadow-2xl hover:shadow-cyan-400/30 hover:scale-105 transition-all uppercase tracking-widest flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Citizen Portal</span>
            </div>
            <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
          </button>

          {/* Government Portal Button */}
          <button
            onClick={handleGovtClick}
            className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-emerald-400/10 to-green-500/10 border-2 border-emerald-400/30 hover:border-emerald-400 text-white font-semibold text-sm hover:shadow-2xl hover:shadow-emerald-400/30 hover:scale-105 transition-all uppercase tracking-widest flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>Admin Portal</span>
            </div>
            <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
