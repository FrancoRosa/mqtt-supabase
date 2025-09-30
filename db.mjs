import { createClient } from "@supabase/supabase-js";
import { supabase_url, supabase_anon_key } from "./credentials.mjs";

// Create a single supabase client for interacting with your database
const supabase = createClient(supabase_url, supabase_anon_key);

export const getDevices = async () => {
  const { data } = await supabase
    .from("sensecap_latest")
    .select("id, eui, name");
  return data;
};

export const uploadData = async (payload) => {
  if (payload.valid) {
    const { date, id, variable, val } = payload;
    await supabase
      .from("sensecap_latest")
      .update({ updated_at: date, [variable]: val })
      .eq("id", id);
  }
  return "good";
};
