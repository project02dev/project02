import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, Profile } from "@/lib/supabase";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile helper
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      setProfile(null);
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth changes and handle profile creation if needed
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        handleProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await handleProfile(session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, []);

  // Create profile if it doesn't exist, using localStorage for pending sign up info
  const handleProfile = async (user: User) => {
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profileData && !profileError) {
      // No profile exists, try to create one from localStorage
      const username = localStorage.getItem("pending_username");
      const role = localStorage.getItem("pending_role");
      if (username && role) {
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            username,
            role,
            full_name: username,
          },
        ]);
        if (insertError) {
          console.error("Error creating profile:", insertError);
        } else {
          // Clean up
          localStorage.removeItem("pending_username");
          localStorage.removeItem("pending_role");
        }
      }
    }
    await fetchProfile(user.id);
  };

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
    // Store pending profile info for after auth
    localStorage.setItem("pending_username", username);
    localStorage.setItem("pending_role", role);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Do not create profile here; it will be handled after auth state change
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
