import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mewjhcheciafyuxkngqn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld2poY2hlY2lhZnl1eGtuZ3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTMwMDUsImV4cCI6MjA4Nzc2OTAwNX0.oRQTlk-bpVNNxkEmklgaNZvLxIIvXJAJTZVyU-FK0bQ';

console.log('Initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Sending request to Supabase Auth API...');
try {
  const { data, error } = await supabase.auth.getUser();
  console.log('Response received!');
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success! User data:', data);
  }
} catch (err) {
  console.error('Fatal connection error:', err);
}
process.exit(0);
