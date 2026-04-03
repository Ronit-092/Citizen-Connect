import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold mb-4 text-primary">404</h1>
        <p className="text-3xl font-bold mb-4">Page Not Found</p>
        <p className="text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist. Let's get you back
          on track.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all transform hover:scale-105"
        >
          <Home className="w-5 h-5" />
          Return to Home
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
