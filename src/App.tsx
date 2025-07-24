import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Header } from "@/components/Header";
import { HomePage } from "@/pages/HomePage";
import { AuthPage } from "@/pages/AuthPage";
import { StudentDashboard } from "@/pages/student/StudentDashboard";
import { BrowseProjects } from "@/pages/student/BrowseProjects";
import { OrderHistory } from "@/pages/student/OrderHistory";
import { Messages } from "@/pages/student/Messages";
import { Wallet } from "@/pages/student/Wallet";
import { CustomRequests } from "@/pages/student/CustomRequests";
import { CreatorDashboard } from "@/pages/creator/CreatorDashboard";
import { ProjectManagement } from "@/pages/creator/ProjectManagement";
import { Earnings } from "@/pages/creator/Earnings";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { UserManagement } from "@/pages/admin/UserManagement";
import { ContentModeration } from "@/pages/admin/ContentModeration";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { CustomRequestPage } from "@/pages/CustomRequestPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { FAQPage } from "@/pages/FAQPage";
import { TermsPage } from "@/pages/TermsPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { SupportPage } from "@/pages/SupportPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { VerifyEmailPage } from "@/pages/VerifyEmailPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailPage />} />
                  <Route
                    path="/custom-request"
                    element={<CustomRequestPage />}
                  />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />

                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />

                  {/* Student Routes */}
                  <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                  />

                  {/* Creator Routes */}
                  <Route
                    path="/creator/dashboard"
                    element={<CreatorDashboard />}
                  />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
