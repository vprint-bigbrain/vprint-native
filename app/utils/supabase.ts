import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bhugrcgkacjiewxlyvwh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJodWdyY2drYWNqaWV3eGx5dndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NTQ0NDIsImV4cCI6MjAyODIzMDQ0Mn0.ZUr5VzvMob1rzF-vg6klktEe8H3RPogaA87AS5WAuz8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
