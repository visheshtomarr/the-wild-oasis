import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wofuvbrwbydclkzmsvbg.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvZnV2YnJ3YnlkY2xrem1zdmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDM1MTcsImV4cCI6MjA2OTI3OTUxN30.9u48yfiNNYJeNi9XXIgie7pqw9IrPBheUGgtuGuI5TA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;