import { Statistics } from "../types/statistics";

export const MOCK_STATISTICS: Statistics = {
  totalDevices: 6,
  onlineDevices: 5,
  offlineDevices: 1,

  normalDevices: 3,
  warningDevices: 1,
  alertDevices: 1,

  totalAlerts: 4,
  activeAlerts: 3,

  averageCoPpm: 36.6, // (8+12+45+150+5+0)/6
  maxCoPpm: 150,
};
