import { createClient } from "@supabase/supabase-js";

// Ensure your .env.local file has these variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
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
