// This imports the Supabase client library
import { createClient } from '@supabase/supabase-js'

// We get the keys from environment variables for security.
// Your build tool will find them in the .env file you created.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Recipe = {
  id: string
  title: string
  description: string
  image_url?: string
  ingredients?: string[]
  instructions?: string
  cookingTime?: number
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

export type SavedRecipe = {
  id: string
  user_id: string
  recipe_data: Recipe
  created_at: string
}