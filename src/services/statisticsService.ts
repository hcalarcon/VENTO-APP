import { supabase } from "../lib/supabase";

const ONLINE_THRESHOLD = 30_000;

function isOnline(lastReadingAt: string | null) {
  if (!lastReadingAt) return false;

  return Date.now() - new Date(lastReadingAt).getTime() < ONLINE_THRESHOLD;
}

export const getStatistics = async () => {
  // =========================
  // DISPOSITIVOS
  // =========================

  const { data: devices, error: devicesError } = await supabase
    .from("devices")
    .select("id, enabled");

  if (devicesError) {
    throw devicesError;
  }

  const deviceList = devices ?? [];

  let onlineDevices = 0;
  let offlineDevices = 0;
  let normalDevices = 0;
  let warningDevices = 0;
  let alertDevices = 0;

  for (const device of deviceList) {
    const { data: reading } = await supabase
      .from("lecturas")
      .select("co_ppm, alert, created_at")
      .eq("device_id", device.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastReadingAt = reading?.created_at ?? null;

    const online = device.enabled && isOnline(lastReadingAt);

    if (online) {
      onlineDevices++;
    } else {
      offlineDevices++;
    }

    if (!online || !reading) {
      continue;
    }

    const coPpm = Number(reading.co_ppm);

    if (reading.alert || coPpm >= 80) {
      alertDevices++;
    } else if (coPpm >= 50) {
      warningDevices++;
    } else {
      normalDevices++;
    }
  }

  // =========================
  // LECTURAS
  // =========================

  const { data: readings, error: readingsError } = await supabase
    .from("lecturas")
    .select("id, device_id, co_ppm, alert, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (readingsError) {
    throw readingsError;
  }

  const allReadings = readings ?? [];

  const coValues = allReadings.map((reading) => Number(reading.co_ppm));

  const averageCoPpm =
    coValues.length > 0
      ? coValues.reduce((sum, value) => sum + value, 0) / coValues.length
      : 0;

  const maxCoPpm = coValues.length > 0 ? Math.max(...coValues) : 0;

  const totalAlerts = allReadings.filter((reading) => reading.alert).length;

  // =========================
  // HISTORIAL CO
  // =========================

  const coHistory = [...allReadings]
    .slice(0, 30)
    .reverse()
    .map((reading) => ({
      value: Number(reading.co_ppm),
      createdAt: reading.created_at,
    }));

  // =========================
  // ALERTAS POR DÍA
  // =========================

  const alertsByDayMap: Record<string, number> = {};

  allReadings
    .filter((reading) => reading.alert)
    .forEach((reading) => {
      const date = new Date(reading.created_at);

      const key = date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
      });

      alertsByDayMap[key] = (alertsByDayMap[key] ?? 0) + 1;
    });

  const alertsByDay = Object.entries(alertsByDayMap)
    .slice(-7)
    .map(([date, count]) => ({
      date,
      count,
    }));

  return {
    totalDevices: deviceList.length,
    onlineDevices,
    offlineDevices,

    normalDevices,
    warningDevices,
    alertDevices,

    totalAlerts,

    // No existe todavía estado de alerta en DB.
    activeAlerts: totalAlerts,

    averageCoPpm,
    maxCoPpm,

    coHistory,
    alertsByDay,
  };
};
