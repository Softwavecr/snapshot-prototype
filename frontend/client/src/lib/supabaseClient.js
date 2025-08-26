import { createClient } from '@supabase/supabase-js';

function supabaseApp() { 
  return createClient(import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_SERVICE_ROLE);
}
export default supabaseApp
