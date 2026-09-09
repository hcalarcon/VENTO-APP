export interface Device {
  id: string;
  name: string;
  location: string | null;
  enabled: boolean;
  lastReadingAt: string | null;
  lastCoPpm: number | null;
  status: "normal" | "warning" | "alert" | "offline";
  createdAt: string;
}
