import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  MapPin,
  Eye,
  Bell,
  Shield,
  BarChart3,
  Camera,
  Clock,
  Users,
  Heart,
  Scale,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";
import Logo from "@/components/Logo";

export default function Index() {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Sample complaints data to calculate stats (matching CitizenDashboard)
  const SAMPLE_COMPLAINTS = [
    { status: "pending" },
    { status: "in-progress" },
    { status: "resolved" },
    { status: "pending" },
    { status: "in-progress" },
  ];

  const totalIssues = SAMPLE_COMPLAINTS.length;
  const resolvedIssues = SAMPLE_COMPLAINTS.filter(
    (c) => c.status === "resolved",
  ).length;
  const resolutionRate =
    totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  const stats = [
    {
      label: "Issues Filed",
      value: totalIssues.toString(),
      color: "from-cyan-400 to-blue-500",
      icon: FileText,
    },
    {
      label: "Issues Resolved",
      value: resolvedIssues.toString(),
      color: "from-green-400 to-emerald-500",
      icon: CheckCircle2,
    },
    {
      label: "Resolution Rate",
      value: `${resolutionRate}%`,
      color: "from-purple-400 to-pink-500",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden cyber-grid">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-2s" }}></div>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      {/* Navigation */}
      <nav className="px-6 md:px-12 py-6 flex justify-between items-center glass border-b border-cyan-400/20 sticky top-0 z-40">
        <div className="flex items-center gap-3 animate-slide-cyber">
          <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
          <span className="text-xl sm:text-2xl font-bold text-gradient-cyber">
            CitizenConnect
          </span>
        </div>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="btn-cyber"
        >
          <Shield className="w-4 h-4 mr-2" />
          Access Portal
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <div className="animate-slide-cyber" style={{ animationDelay: "0.1s" }}>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-400/30 mb-6 w-fit animate-glow hologram"
              style={{ animationDelay: "0.2s" }}
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">
                Smart Civic Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-gradient-cyber"
              style={{ animationDelay: "0.3s" }}
            >
              Your Voice, <span>Their Action</span>
            </h1>

            {/* Description */}
            <p
              className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg"
              style={{ animationDelay: "0.4s" }}
            >
              Bridge the digital divide between citizens and government. Report community
              issues easily, track real-time progress, and enforce accountability with
              complete transparency.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex gap-4 mb-12 flex-wrap"
              style={{ animationDelay: "0.5s" }}
            >
              <Link
                to="/public-map"
                className="btn-primary-cyber group"
              >
                <MapPin className="w-5 h-5 mr-2" />
                View Live Board <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="btn-secondary-cyber"
              >
                Access Portal
              </button>
            </div>
          </div>

          {/* Right - Holographic Interface */}
          <div
            className="relative animate-float"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="glass-strong rounded-3xl p-8 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-500 relative overflow-hidden">
              {/* Holographic Scan Line */}
              <div className="absolute inset-0 hologram"></div>
              
              <div className="space-y-4 relative z-10">
                {/* System Status */}
                <div className="glass rounded-lg p-4 border border-green-400/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <p className="font-semibold text-green-300">System Active</p>
                  </div>
                  <p className="text-sm text-gray-400">Connection established</p>
                </div>
                
                {/* Data Stream */}
                <div className="glass rounded-lg p-4 border border-cyan-400/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                    <p className="font-semibold text-cyan-300">Live Updates</p>
                  </div>
                  <p className="text-sm text-gray-400">Real-time issue tracking active</p>
                </div>
                
                {/* Processing */}
                <div className="glass rounded-lg p-4 border border-purple-400/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-300">Processing</span>
                    <span className="text-xs text-gray-400">99.7% Efficiency</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 w-[97%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-12 py-20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-400/30 mb-4">
              <span className="text-purple-400 text-sm font-semibold">KEY FEATURES</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gradient-cyber">
              Everything You Need for{" "}
              <span>Better Communities</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Easy-to-use platform designed to help you report and track civic issues with transparency and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Easy Filing",
                desc: "Submit complaints quickly and easily with location pinning and photo attachments.",
                color: "from-cyan-400 to-blue-500",
              },
              {
                icon: MapPin,
                title: "Location Tracking",
                desc: "Pin exact locations of issues on interactive maps for better resolution.",
                color: "from-purple-400 to-pink-500",
              },
              {
                icon: Eye,
                title: "Transparency",
                desc: "View all updates and track your complaint status in real-time.",
                color: "from-green-400 to-teal-500",
              },
              {
                icon: Bell,
                title: "Notifications",
                desc: "Get instant updates when your complaints are reviewed or resolved.",
                color: "from-orange-400 to-red-500",
              },
              {
                icon: Shield,
                title: "Secure",
                desc: "Your data is safe and protected with industry-standard encryption.",
                color: "from-indigo-400 to-purple-500",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                desc: "View statistics and trends about reported issues in your area.",
                color: "from-pink-400 to-rose-500",
              },
              {
                icon: Camera,
                title: "Evidence Capture",
                desc: "Attach photos and videos as proof when filing complaints.",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: Clock,
                title: "Fast Support",
                desc: "Quick response times from government officials and authorities.",
                color: "from-teal-400 to-green-500",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="card-cyber group relative overflow-hidden"
                style={{ animationDelay: `${0.1 * idx}s` }}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 neon-border`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-cyan-300 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-6 md:px-12 py-20 bg-black/40 border-y border-cyan-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-400/30 mb-4">
              <span className="text-cyan-400 text-sm font-semibold">OUR IMPACT</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient-cyber mb-4">
              Our Impact
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real-time analytics from our community platform helping resolve issues faster
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50,000+", label: "Issues Resolved", color: "text-cyan-400", icon: "⚡" },
              { number: "99.7%", label: "Success Rate", color: "text-green-400", icon: "🔥" },
              { number: "12min", label: "Average Response", color: "text-purple-400", icon: "⚡" },
              { number: "500+", label: "Active Cities", color: "text-pink-400", icon: "🌐" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center group relative overflow-hidden p-6 card-cyber hover:scale-105 transform transition-all duration-500"
                style={{ animationDelay: `${0.1 * idx}s` }}
              >
                <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="text-2xl mb-4 relative z-10 group-hover:animate-bounce">{stat.icon}</div>
                
                {/* Number */}
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color} font-mono relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-gray-400 text-xs uppercase tracking-wider relative z-10 group-hover:text-gray-300 transition-colors">
                  {stat.label}
                </div>
                
                {/* Scanning Line Animation */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform translate-x-[-100%] group-hover:animate-scan"></div>
                
                {/* Corner Brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23334155' stroke-width='0.5' opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
          }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-400/30 mb-6">
                <span className="text-cyan-400 text-sm font-semibold">ABOUT US</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-cyber">
                Connecting{" "}
                <span>Citizens & Government</span>
              </h2>
              
              <p className="text-gray-400 mb-6 leading-relaxed text-lg">
                CitizenConnect is a simple, effective platform that helps you report and track civic issues. 
                We bridge the gap between citizens and government to solve problems faster.
              </p>
              
              <p className="text-gray-400 mb-8 leading-relaxed">
                Whether it's a pothole, water issue, or street light, you can report it easily with location details and photos. 
                Track progress in real-time and see when your issue gets resolved.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { text: "Secure reporting", icon: "🔒" },
                  { text: "Real-time tracking", icon: "⚡" },
                  { text: "Photo evidence", icon: "📸" },
                  { text: "Direct updates", icon: "📬" },
                  { text: "Full transparency", icon: "👁️" },
                  { text: "Fast resolution", icon: "✅" },
                ].map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 animate-slide-up group cursor-pointer"
                    style={{ animationDelay: `${0.1 * idx}s` }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400/20 to-purple-400/20 flex items-center justify-center border border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors">
                      <span className="text-sm">{benefit.icon}</span>
                    </div>
                    <span className="text-gray-300 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Neural Interface Visualization */}
            <div className="relative">
              {/* Main Neural Interface */}
              <div className="glass-strong rounded-2xl p-8 border border-cyan-400/30 relative overflow-hidden">
                {/* Neural Network Animation */}
                <div className="absolute inset-0">
                  <div className="neural-bg opacity-20"></div>
                </div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-cyan-300">Neural Interface</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-green-300 text-sm font-mono">ONLINE</span>
                    </div>
                  </div>

                  {/* System Stats */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-cyan-400/20">
                      <span className="text-gray-400">Active Users</span>
                      <span className="text-cyan-300 font-mono">1,247,892</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-purple-400/20">
                      <span className="text-gray-400">Uptime</span>
                      <span className="text-purple-300 font-mono">99.97%</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-green-400/20">
                      <span className="text-gray-400">Response Speed</span>
                      <span className="text-green-300 font-mono">847 ms</span>
                    </div>
                  </div>

                  {/* Performance Visualization */}
                  <div className="mt-8">
                    <p className="text-gray-400 text-sm mb-4">System Status</p>
                    <div className="space-y-2">
                      {[95, 87, 92, 78].map((progress, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="text-xs text-gray-500 w-12">{`City${idx + 1}`}</div>
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                idx === 0 ? 'bg-gradient-to-r from-cyan-400 to-blue-400' :
                                idx === 1 ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                                idx === 2 ? 'bg-gradient-to-r from-green-400 to-teal-400' :
                                'bg-gradient-to-r from-orange-400 to-red-400'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 w-8">{progress}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Holographic Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] animate-hologram"></div>
              </div>

              {/* Floating Neural Nodes */}
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-teal-400 animate-bounce"></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-ping"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - System Performance */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-r from-purple-900/90 via-black to-cyan-900/90 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M30 0v60M0 30h60' stroke='%23334155' stroke-width='0.5' opacity='0.3'/%3e%3c/svg%3e")`,
          }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-400/30 mb-6">
              <span className="text-cyan-400 text-sm font-semibold">SYSTEM GUARANTEES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-cyber mb-6">
              Proven <span>Performance</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Reliable promises backed by real results and community impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "100%", label: "Full Transparency", icon: "🔒", color: "from-cyan-400 to-blue-500" },
              { value: "24/7", label: "Always Open", icon: "⚡", color: "from-purple-400 to-pink-500" },
              { value: "Real-time", label: "Live Updates", icon: "📡", color: "from-green-400 to-teal-500" },
              { value: "Direct", label: "Official Support", icon: "🌐", color: "from-orange-400 to-red-500" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden card-cyber hover:scale-110 transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${0.1 * idx}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10 p-8">
                  {/* Icon */}
                  <div className="text-3xl mb-4 group-hover:animate-pulse">{stat.icon}</div>
                  
                  {/* Value */}
                  <p className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-mono group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </p>
                  
                  {/* Label */}
                  <p className="text-gray-400 text-sm uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </p>
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                {/* Corner Brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Portals Section */}
      <section className="px-6 md:px-12 py-20 bg-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-400/30 mb-6">
              <span className="text-purple-400 text-sm font-semibold">GET STARTED</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-cyber">
              Choose Your <span>Role</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Select your role to access the right tools and features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Citizens Portal */}
            <div className="group relative overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500">
              {/* Main Card */}
              <div className="glass-strong rounded-3xl p-12 border border-cyan-400/30 group-hover:border-cyan-400/60 transition-all duration-300 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with Animation */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 neon-border">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-bold mb-4 text-cyan-300 group-hover:text-white transition-colors">
                    Citizens Portal
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 mb-8 leading-relaxed group-hover:text-gray-300 transition-colors">
                    Report community issues easily, upload photos as evidence, and track government response in
                    real-time. Your voice matters and drives positive change.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {[
                      "🔥 Quick issue reporting",
                      "📡 Location mapping", 
                      "⚡ Real-time tracking",
                      "📸 Photo evidence upload"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <Link
                    to="/citizen-signup"
                    className="btn-cyber w-full flex items-center justify-center gap-3"
                  >
                    <span>Start Reporting</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Interactive Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse opacity-80"></div>
              <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-ping opacity-60"></div>
            </div>

            {/* Government Portal */}
            <div className="group relative overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500">
              {/* Main Card */}
              <div className="glass-strong rounded-3xl p-12 border border-purple-400/30 group-hover:border-purple-400/60 transition-all duration-300 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with Animation */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 neon-border">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-bold mb-4 text-purple-300 group-hover:text-white transition-colors">
                    Admin Portal
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 mb-8 leading-relaxed group-hover:text-gray-300 transition-colors">
                    Manage citizen reports efficiently, assign tasks to teams, track progress with real-time
                    analytics, and demonstrate accountability through transparent operations.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {[
                      "🎯 Issue management",
                      "🤖 Smart task assignment",
                      "📊 Real-time analytics", 
                      "🔗 Complete transparency"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                        <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="btn-cyber-alt w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                  >
                    <span>Admin Login</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Interactive Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse opacity-80"></div>
              <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-ping opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden border-t border-cyan-500/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M50 0L50 100M0 50L100 50' stroke='%23334155' stroke-width='0.5' opacity='0.3'/%3e%3ccircle cx='50' cy='50' r='20' fill='none' stroke='%23334155' stroke-width='0.3' opacity='0.2'/%3e%3c/svg%3e")`,
          }}></div>
        </div>
        
        {/* Floating Neural Nodes */}
        <div className="absolute top-10 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-32 right-32 w-3 h-3 bg-purple-400 rounded-full animate-float-delayed opacity-40"></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-float opacity-50"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-6">
                <Logo className="w-12 h-12" />
                <span className="text-2xl font-bold text-gradient-cyber">
                  CitizenConnect
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                A smart platform designed to bridge the gap between citizens and government.
                Report issues easily, track progress in real-time, and help build better communities.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { icon: "🌐", color: "from-cyan-400 to-blue-500" },
                  { icon: "⚡", color: "from-purple-400 to-pink-500" },
                  { icon: "🧠", color: "from-green-400 to-teal-500" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${social.color} flex items-center justify-center text-white hover:scale-110 transition-all duration-300 neon-border opacity-80 hover:opacity-100`}
                  >
                    <span className="text-sm">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h4 className="font-bold text-cyan-300 mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {[
                  "How It Works",
                  "Get Started", 
                  "FAQs",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-300 transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h4 className="font-bold text-purple-300 mb-6 text-lg">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 text-gray-400 hover:text-purple-300 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center border border-purple-400/30 group-hover:border-purple-400/60 transition-colors">
                    <span>📧</span>
                  </div>
                  <a href="mailto:support@citizencare.in">
                    support@citizencare.in
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-400 hover:text-purple-300 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center border border-purple-400/30 group-hover:border-purple-400/60 transition-colors">
                    <span>📱</span>
                  </div>
                  <a href="tel:1800-CITIZEN-00">1800-CITIZEN-00</a>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center border border-purple-400/30 mt-0">
                    <span>🌐</span>
                  </div>
                  <span>India · Available 24/7</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h4 className="font-bold text-green-300 mb-6 text-lg">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">
                Stay updated with latest features and improvements
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-lg hover:from-cyan-300 hover:to-purple-500 transition-all transform hover:scale-105 active:scale-95 font-mono">
                  →
                </button>
              </div>
              
              {/* System Status */}
              <div className="glass rounded-lg p-3 border border-green-400/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-green-300 text-xs font-semibold">SYSTEM ONLINE</span>
                </div>
                <p className="text-gray-400 text-xs">Uptime: 99.97% • Response: 847 ms</p>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; 2025 CitizenCare. Building better communities together. All rights reserved.
              </p>
              
              {/* System Status */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span className="text-cyan-300 font-mono">SECURE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                  <span className="text-purple-300 font-mono">ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-green-300 font-mono">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
