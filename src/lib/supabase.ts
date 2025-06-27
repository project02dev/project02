
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pcmhazlrgdqqaduocpps.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbWhhemxyZ2RxcWFkdW9jcHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzYxMDMsImV4cCI6MjA2MTg1MjEwM30.g-IoznI_P3eS9DHKRTtjt2idZt69JWj6ygCPwFE3S8I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  bio?: string
  role: 'student' | 'creator' | 'admin'
  is_verified: boolean
  created_at: string
}

export type Project = {
  id: string
  creator_id: string
  title: string
  slug: string
  description: string
  price: number
  thumbnail_url?: string
  tags?: string[]
  is_featured: boolean
  view_count: number
  created_at: string
}

export type Department = {
  id: string
  name: string
  slug: string
  icon?: string
}
