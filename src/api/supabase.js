
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://ynwkrvwxapjvfqgjkhfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2tydnd4YXBqdmZxZ2praGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1Nzk5ODMsImV4cCI6MjA1MTE1NTk4M30.gCe9ZbGxjJjJJElcV51Vz5Pk_ZhLX0FHoXbiamB3DFs';

// Inicializar el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; // Cambiar a export default