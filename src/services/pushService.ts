import { supabase } from "../lib/supabase";

export const registerPushToken = async (
  token: string,
  role: "owner" | "viewer",
) => {
  const { data, error } = await supabase
    .from("push_subscriptions")
    .upsert(
      {
        expo_push_token: token,
        role,
        enabled: true,
      },
      {
        onConflict: "expo_push_token",
      },
    )
    .select()
    .single();

  if (error) {
    console.error("❌ Error registrando Push Token:", error);
    throw error;
  }

  console.log("✅ Push Token registrado:", data);

  return data;
};
