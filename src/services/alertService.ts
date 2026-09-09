import { supabase } from "../lib/supabase";
import type { Alert } from "../types/alert";

type AlertRow = {
  id: number;
  device_id: string;
  co_ppm: number;
  alert: boolean;
  created_at: string;
};

const mapAlert = async (row: AlertRow): Promise<Alert> => {
  const { data: device } = await supabase
    .from("devices")
    .select("name, location")
    .eq("id", row.device_id)
    .maybeSingle();

  const coPpm = Number(row.co_ppm);

  return {
    id: String(row.id),
    deviceId: row.device_id,
    deviceName: device?.name ?? "Dispositivo",
    location: device?.location ?? "Sin ubicación",
    type: coPpm >= 80 ? "co_critical" : "co_warning",
    severity: coPpm >= 80 ? "critical" : "warning",
    coPpm,
    message:
      coPpm >= 80
        ? "Niveles de CO críticos detectados."
        : "Niveles de CO elevados detectados.",
    createdAt: row.created_at,
    resolved: false,
  };
};

// Todas las lecturas que fueron alertas
export const getAlerts = async (): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from("lecturas")
    .select("id, device_id, co_ppm, alert, created_at")
    .eq("alert", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando alertas:", error);
    throw error;
  }

  return Promise.all(((data as AlertRow[]) ?? []).map(mapAlert));
};

// Por ahora no existe estado "activa/resuelta" en DB.
// Devuelve las alertas más recientes.
export const getActiveAlerts = async (): Promise<Alert[]> => {
  return getAlerts();
};

// Alertas de un dispositivo
export const getAlertsByDevice = async (deviceId: string): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from("lecturas")
    .select("id, device_id, co_ppm, alert, created_at")
    .eq("device_id", deviceId)
    .eq("alert", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando alertas del dispositivo:", error);
    throw error;
  }

  return Promise.all(((data as AlertRow[]) ?? []).map(mapAlert));
};

// Realtime: nueva lectura con alert=true
export const subscribeToAlerts = (
  onAlert: (alert: Alert) => void,
  channelName = "alerts-realtime",
) => {
  const uniqueChannelName = `${channelName}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  console.log(`📡 Creando canal ${uniqueChannelName}...`);

  const channel = supabase
    .channel(uniqueChannelName)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "lecturas",
        filter: "alert=eq.true",
      },
      async (payload) => {
        console.log("🚨 REALTIME RECIBIDO:", payload);

        const row = payload.new as AlertRow;
        const alert = await mapAlert(row);

        console.log("🚨 ALERTA MAPEADA:", alert);

        onAlert(alert);
      },
    )
    .subscribe((status) => {
      console.log(`📡 REALTIME STATUS ${uniqueChannelName}:`, status);
    });

  return () => {
    console.log(`📡 Cerrando ${uniqueChannelName}...`);
    supabase.removeChannel(channel);
  };
};
