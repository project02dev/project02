import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  PenTool, 
  Shield, 
  ArrowRight,
  Loader2 
} from "lucide-react";

export const DashboardPage = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (!loading && user && profile) {
      // Auto-redirect based on user role
      switch (profile.role) {
        case "student":
          navigate("/student/dashboard");
          break;
        case "creator":
          navigate("/creator/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          break;
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If role is not set or needs selection
  const handleRoleSelect = (role: "student" | "creator" | "admin") => {
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to PROJECT02</h1>
        <p className="text-muted-foreground">
          Choose your dashboard to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>Student Dashboard</CardTitle>
            <CardDescription>
              Browse projects, place orders, and track your academic needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleRoleSelect("student")} 
              className="w-full"
            >
              Go to Student Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center">
              <PenTool className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Creator Dashboard</CardTitle>
            <CardDescription>
              Manage your projects, track earnings, and help students succeed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleRoleSelect("creator")} 
              className="w-full"
            >
              Go to Creator Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Manage platform operations, users, and content moderation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleRoleSelect("admin")} 
              className="w-full"
            >
              Go to Admin Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Need help getting started?
        </p>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate("/onboarding")}>
            Take the Tour
          </Button>
          <Button variant="outline" onClick={() => navigate("/support")}>
            Get Support
          </Button>
        </div>
      </div>
    </div>
  );
};