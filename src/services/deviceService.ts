import { supabase } from "../lib/supabase";
import type { Device } from "../types/device";

type DeviceRow = {
  id: string;
  name: string;
  location: string | null;
  enabled: boolean;
  last_reading_at: string | null;
  created_at: string;
  lecturas: {
    co_ppm: number;
    created_at: string;
  }[];
};

function getStatus(enabled: boolean, coPpm: number | null): Device["status"] {
  if (!enabled) {
    return "offline";
  }

  if (coPpm === null) {
    return "normal";
  }

  if (coPpm >= 80) {
    return "alert";
  }

  if (coPpm >= 50) {
    return "warning";
  }

  return "normal";
}

export const getDevices = async (): Promise<Device[]> => {
  const { data, error } = await supabase
    .from("devices")
    .select(
      `
      id,
      name,
      location,
      enabled,
      last_reading_at,
      created_at,
      lecturas (
        co_ppm,
        created_at
      )
    `,
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data as DeviceRow[]) ?? []).map((device) => {
    const readings = [...(device.lecturas ?? [])].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const lastReading = readings[0];

    const lastCoPpm = lastReading?.co_ppm ?? null;

    return {
      id: device.id,
      name: device.name,
      location: device.location,
      enabled: device.enabled,
      lastReadingAt: device.last_reading_at ?? lastReading?.created_at ?? null,
      lastCoPpm,
      status: getStatus(device.enabled, lastCoPpm),
      createdAt: device.created_at,
    };
  });
};

export const getDeviceById = async (
  id: string,
): Promise<Device | undefined> => {
  const devices = await getDevices();

  return devices.find((device) => device.id === id);
};
