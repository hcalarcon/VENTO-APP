import { supabase } from "../lib/supabase";
import type { Reading } from "../types/reading";

type ReadingRow = {
  id: number;
  device_id: string;
  co_ppm: number;
  alert: boolean;
  created_at: string;
};

export const getReadingsByDevice = async (
  deviceId: string,
  limit = 30,
): Promise<Reading[]> => {
  const { data, error } = await supabase
    .from("lecturas")
    .select(
      `
      id,
      device_id,
      co_ppm,
      alert,
      created_at
    `,
    )
    .eq("device_id", deviceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error cargando lecturas:", error);
    throw error;
  }

  return ((data as ReadingRow[]) ?? []).map((reading) => ({
    id: reading.id,
    deviceId: reading.device_id,
    coPpm: reading.co_ppm,
    alert: reading.alert,
    createdAt: reading.created_at,
  }));
};
