import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CitizenLogin from "./pages/CitizenLogin";
import CitizenSignup from "./pages/CitizenSignup";
import GovtLogin from "./pages/GovtLogin";
import GovtSignup from "./pages/GovtSignup";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenProfile from "./pages/CitizenProfile";
import GovtDashboard from "./pages/GovtDashboard";
import PublicMap from "./pages/PublicMap";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/public-map" element={<PublicMap />} />
          <Route path="/citizen-login" element={<CitizenLogin />} />
          <Route path="/citizen-signup" element={<CitizenSignup />} />
          <Route path="/govt-login" element={<GovtLogin />} />
          <Route path="/govt-signup" element={<GovtSignup />} />
          <Route
            path="/citizen-dashboard"
            element={
              <ProtectedRoute requiredRole="citizen">
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen-profile"
            element={
              <ProtectedRoute requiredRole="citizen">
                <CitizenProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/govt-dashboard"
            element={
              <ProtectedRoute requiredRole="government">
                <GovtDashboard />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
