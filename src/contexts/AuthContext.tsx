import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, Profile } from "@/lib/supabase"; // Ensure this path is correct

// Define the shape of the Auth context
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string,
    role: "student" | "creator"
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// The AuthProvider component that wraps your app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Centralized function to fetch a user's profile
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data;
  };

  // Handles profile creation if one doesn't exist
  const handleProfile = async (user: User) => {
    let userProfile = await fetchProfile(user.id);

    if (!userProfile) {
      // If no profile exists, create one
      const username =
        localStorage.getItem("pending_username") ||
        user.user_metadata.full_name ||
        user.email?.split("@")[0]; // Fallback to email prefix

      const role =
        (localStorage.getItem("pending_role") as Profile["role"]) || "student";

      const { data: newUserProfile, error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            username,
            full_name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
            role,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating profile:", insertError);
      } else {
        userProfile = newUserProfile;
        // Clean up localStorage after profile creation
        localStorage.removeItem("pending_username");
        localStorage.removeItem("pending_role");
      }
    }
    setProfile(userProfile);
  };

  // useEffect to manage session and auth state changes
  useEffect(() => {
    const getActiveSession = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await handleProfile(session.user);
      }
      setLoading(false);
    };

    getActiveSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      setUser(session?.user ?? null);
      if (
        session?.user &&
        (event === "SIGNED_IN" || event === "USER_UPDATED")
      ) {
        await handleProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --- Auth Functions ---

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
    role: "student" | "creator"
  ) => {
    // Store metadata in localStorage to be used after the user confirms their email
    localStorage.setItem("pending_username", username);
    localStorage.setItem("pending_role", role);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      // If sign-up fails, clean up localStorage
      localStorage.removeItem("pending_username");
      localStorage.removeItem("pending_role");
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) throw error;
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
    if (error) throw error;
  };

  // The value provided to the context consumers
  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resendConfirmation,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
