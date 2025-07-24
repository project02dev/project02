import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://pcmhazlrgdqqaduocpps.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbWhhemxyZ2RxcWFkdW9jcHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNTQ4ODIsImV4cCI6MjA2ODkzMDg4Mn0.VYmlFgwIhb_-V-kGxUqyPvhHzfXWYhBAjDVVT_5Vkis";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase configuration missing. Please check your environment variables or update supabase.ts with your credentials.");
  throw new Error("Missing Supabase URL or Anon Key");
}

// Define types for your database tables for better type safety
export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  role: "student" | "creator" | "admin";
  is_verified: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail_url?: string;
  tags?: string[];
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

// It's a good practice to type the client for full type-safety
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
