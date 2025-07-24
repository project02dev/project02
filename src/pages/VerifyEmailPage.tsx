import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        if (type === "recovery") {
          // Handle password recovery
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "recovery"
          });

          if (error) throw error;

          setStatus("success");
          setMessage("Email verified! You can now reset your password.");
          setTimeout(() => navigate("/auth?tab=reset-password"), 2000);
        } else {
          // Handle email confirmation
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email"
          });

          if (error) throw error;

          setStatus("success");
          setMessage("Email verified successfully! You can now sign in.");
          setTimeout(() => navigate("/auth"), 2000);
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Verification failed");
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    verifyEmail();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            Verifying your email address...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying your email...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <Alert className="border-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                <Button onClick={() => navigate("/auth")} className="w-full">
                  Go to Sign In
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};