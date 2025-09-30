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
};

// const channel = supabase
//   .channel("sensecap_latest_updates")
//   .on(
//     "postgres_changes",
//     {
//       event: "UPDATE",
//       schema: "public",
//       table: "sensecap_latest",
//     },
//     async (payload) => {
//       if (payload.old.updated_at !== payload.new.updated_at) {
//         // The old record contains the values before the update
//         const recordToInsert = {
//           ...payload.old,
//           sensecap_id: payload.old.id,
//         };

//         // Assuming 'sensecap_records' has its own auto-incrementing primary key,
//         // we remove the 'id' from the old record to avoid conflicts.
//         // If your 'sensecap_records' table is designed to use the same id,
//         // you can remove the following line.
//         delete recordToInsert.id;
//         c;

//         const { error } = await supabase
//           .from("sensecap_records")
//           .insert(recordToInsert);

//         if (error) {
//           console.error("Error inserting old record:", error);
//         } else {
//           console.log("Archived old record:", recordToInsert);
//         }
//       }
//     }
//   )
//   .subscribe((status, err) => {
//     if (status === "SUBSCRIBED") {
//       console.log("Subscribed to sensecap_latest updates!");
//     }
//     if (status === "CHANNEL_ERROR") {
//       console.error("Subscription error:", err);
//     }
//   });
