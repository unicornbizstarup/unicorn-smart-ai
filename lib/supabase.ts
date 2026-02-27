import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mewjhcheciafyuxkngqn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld2poY2hlY2lhZnl1eGtuZ3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTMwMDUsImV4cCI6MjA4Nzc2OTAwNX0.oRQTlk-bpVNNxkEmklgaNZvLxIIvXJAJTZVyU-FK0bQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
