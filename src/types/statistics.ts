export interface Statistics {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;

  normalDevices: number;
  warningDevices: number;
  alertDevices: number;

  totalAlerts: number;
  activeAlerts: number;

  averageCoPpm: number;
  maxCoPpm: number;
}
