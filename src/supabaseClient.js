import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pmgddcfylhdjdbeanutb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZ2RkY2Z5bGhkamRiZWFudXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzAyNjYsImV4cCI6MjA2NzA0NjI2Nn0.FWMPadefULRKXKuIu5icoxGCRHMnl9BlUtdiwRQDU9Y';

export const supabase = createClient(supabaseUrl, supabaseKey);
