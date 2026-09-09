import { Alert } from "../types/alert";

export const MOCK_ALERTS: Alert[] = [
  {
    id: "al-001",
    deviceId: "dev-004",
    deviceName: "Sensor Cocina",
    location: "Cocina",
    type: "co_critical",
    severity: "critical",
    coPpm: 150,
    message: "Niveles de CO críticos detectados en Cocina.",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    resolved: false,
  },
  {
    id: "al-002",
    deviceId: "dev-003",
    deviceName: "Sensor Laboratorio",
    location: "Laboratorio",
    type: "co_warning",
    severity: "warning",
    coPpm: 45,
    message: "Niveles de CO elevados en Laboratorio.",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    resolved: false,
  },
  {
    id: "al-003",
    deviceId: "dev-006",
    deviceName: "Sensor Habitación 3",
    location: "Habitación 3",
    type: "device_offline",
    severity: "info",
    message: "Pérdida de conexión con Sensor Habitación 3.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    resolved: false,
  },
  {
    id: "al-004",
    deviceId: "dev-004",
    deviceName: "Sensor Cocina",
    location: "Cocina",
    type: "co_warning",
    severity: "warning",
    coPpm: 35,
    message: "Niveles de CO elevados en Cocina (Resuelto).",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    resolved: true,
  },
];
