import { Tables } from "@/lib/supabase";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          role: "student" | "creator" | "admin";
          avatar_url?: string;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          role: "student" | "creator" | "admin";
          avatar_url?: string;
        };
        Update: {
          username?: string;
          full_name?: string;
          role?: "student" | "creator" | "admin";
          avatar_url?: string;
        };
      };
      testimonials: {
        Row: {
          id: number;
          quote: string;
          name: string;
          role: string;
          avatar: string;
          rating?: number;
          created_at: string;
        };
        Insert: Omit<Tables["testimonials"]["Row"], "id" | "created_at">;
        Update: Partial<Tables["testimonials"]["Insert"]>;
      };
    };
    Enums: {
      user_role: "student" | "creator" | "admin";
    };
  };
};
