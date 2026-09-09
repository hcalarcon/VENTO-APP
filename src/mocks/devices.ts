import { Device } from "../types/device";

export const MOCK_DEVICES: Device[] = [
  {
    id: "dev-001",
    name: "Sensor Habitación 1",
    location: "Habitación 1",
    status: "normal",
    lastSeen: new Date(Date.now() - 10000).toISOString(), // 10s ago
    coPpm: 8,
  },
  {
    id: "dev-002",
    name: "Sensor Habitación 2",
    location: "Habitación 2",
    status: "normal",
    lastSeen: new Date(Date.now() - 15000).toISOString(),
    coPpm: 12,
  },
  {
    id: "dev-003",
    name: "Sensor Laboratorio",
    location: "Laboratorio",
    status: "warning",
    lastSeen: new Date(Date.now() - 5000).toISOString(),
    coPpm: 45,
  },
  {
    id: "dev-004",
    name: "Sensor Cocina",
    location: "Cocina",
    status: "alert",
    lastSeen: new Date(Date.now() - 2000).toISOString(),
    coPpm: 150,
  },
  {
    id: "dev-005",
    name: "Sensor Sala principal",
    location: "Sala principal",
    status: "normal",
    lastSeen: new Date(Date.now() - 8000).toISOString(),
    coPpm: 5,
  },
  {
    id: "dev-006",
    name: "Sensor Habitación 3",
    location: "Habitación 3",
    status: "offline",
    lastSeen: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    coPpm: 0,
  },
];
