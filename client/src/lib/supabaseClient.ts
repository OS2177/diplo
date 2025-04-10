
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixqdcwxpanmcsjwtlfvp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWRjd3hwYW5tY3Nqd3RsZnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDU3MzEsImV4cCI6MjA1OTQyMTczMX0.rFlsgzp7diEyOhQlcY_LU94J7mTdFBFyeL7NT-7bXtc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
