import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dmycweonlhmeborwqbvq.supabase.co/';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
