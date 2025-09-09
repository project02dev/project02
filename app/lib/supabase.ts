import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  role: "student" | "creator" | "admin";
  avatar_url?: string;
  created_at: string;
};

export type Tables = Database["public"]["Tables"];
export type Enums = Database["public"]["Enums"];

export { createClient };
