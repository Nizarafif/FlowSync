import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a real Supabase client if keys are provided, otherwise null
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

// Auth services wrapper
export const authService = {
  async signUp(email: string, name: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'TemporaryPassword123!', // Simple fallback
        options: {
          data: {
            display_name: name,
          }
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Mock SignUp delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { user: { id: `u-${Date.now()}`, email, user_metadata: { display_name: name } } };
    }
  },

  async signIn(email: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Mock SignIn delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { user: { id: 'u-1', email, user_metadata: { display_name: 'Alex Rivera' } } };
    }
  },

  async signOut() {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  }
};
