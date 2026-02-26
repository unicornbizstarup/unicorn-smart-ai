import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joryufdkqxlnaseocolf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvcnl1ZmRrcXhsbmFzZW9jb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzE3MTEsImV4cCI6MjA4NzcwNzcxMX0.QFg75UYcnm_aRiApY6d2zeXYdDF3YE41i28i0KHzG7M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
