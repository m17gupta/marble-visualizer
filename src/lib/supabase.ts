import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client with proper configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
})

// Connection status checker
export const checkConnection = async (): Promise<{
  connected: boolean;
  error?: string;
  latency?: number;
}> => {
  try {
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })
      .limit(1);
    
      console.log('Connection test data:', data);
    const latency = Date.now() - startTime;
    
    if (error) {
      return {
        connected: false,
        error: error.message,
        latency
      };
    }
    
    return {
      connected: true,
      latency
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
};

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  
  if (event === 'SIGNED_IN' && session?.user) {
    console.log('User signed in:', session.user.email);
    // Store the event to help with debugging
    localStorage.setItem('auth_last_event', JSON.stringify({
      event: 'SIGNED_IN',
      time: new Date().toISOString(),
      user: session.user.email
    }));
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
    // Store the event to help with debugging
    localStorage.setItem('auth_last_event', JSON.stringify({
      event: 'SIGNED_OUT',
      time: new Date().toISOString()
    }));
    
    // Clear any local storage or cookies that might persist
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('supabase.auth.')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Force redirect to login page if not already there
    if (!window.location.pathname.includes('login')) {
      window.location.href = '/login';
    }
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed');
    localStorage.setItem('auth_last_event', JSON.stringify({
      event: 'TOKEN_REFRESHED',
      time: new Date().toISOString()
    }));
  } else if (event === 'USER_UPDATED') {
    console.log('User updated');
    localStorage.setItem('auth_last_event', JSON.stringify({
      event: 'USER_UPDATED',
      time: new Date().toISOString()
    }));
  }
});

// Export types for better TypeScript support
export type SupabaseClient = typeof supabase;
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];