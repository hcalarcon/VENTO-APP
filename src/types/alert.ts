export type AlertType = "co_warning" | "co_critical" | "device_offline";

export type AlertSeverity = "info" | "warning" | "critical";

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  type: AlertType;
  severity: AlertSeverity;
  coPpm?: number;
  message: string;
  createdAt: string;
  resolved: boolean;
}
