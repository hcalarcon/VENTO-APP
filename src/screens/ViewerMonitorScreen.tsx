import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { subscribeToAlerts } from "../services/alertService";
import { getDevices } from "../services/deviceService";
import type { Alert } from "../types/alert";
import type { Device } from "../types/device";
import type { AlertScreenParams } from "./AlertScreen";

type ViewerStackParamList = { Monitor: undefined; Alert: AlertScreenParams };

const getLevel = (ppm: number | null) => {
  if (ppm !== null && ppm >= 80)
    return { label: "PELIGRO", color: "#dc2626", bg: "#fee2e2" };
  if (ppm !== null && ppm >= 50)
    return { label: "ATENCION", color: "#a16207", bg: "#fef9c3" };
  return { label: "NORMAL", color: "#15803d", bg: "#dcfce7" };
};

export const ViewerMonitorScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ViewerStackParamList>>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [latestAlert, setLatestAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setDevices(await getDevices());
    } catch (error) {
      console.error("Error cargando monitoreo Viewer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    return subscribeToAlerts((alert) => {
      setLatestAlert(alert);
      refresh();
      navigation.navigate("Alert", alert);
    }, "viewer-realtime");
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  const device = devices.find((item) => item.enabled) ?? devices[0];
  const ppm = latestAlert?.coPpm ?? device?.lastCoPpm ?? null;
  const level = getLevel(ppm);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>VENTO / VIEWER</Text>
        <Text style={styles.title}>Estado del ambiente</Text>
        <Text style={styles.subtitle}>
          Monitoreo activo de niveles de monoxido de carbono
        </Text>

        <View style={[styles.statusPanel, { backgroundColor: level.bg }]}>
          <Text style={[styles.statusLabel, { color: level.color }]}>
            {level.label}
          </Text>
          <Text style={styles.statusPpm}>
            {ppm === null ? "--" : ppm.toFixed(1)}
          </Text>
          <Text style={styles.statusUnit}>ppm de CO</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.sectionLabel}>DISPOSITIVO MONITOREADO</Text>
          <Text style={styles.deviceName}>
            {device?.name ?? "Sin dispositivo"}
          </Text>
          <Text style={styles.location}>
            {device?.location ?? "Ubicacion no disponible"}
          </Text>
          <Text style={styles.lastReading}>
            Ultima lectura:{" "}
            {device?.lastReadingAt
              ? new Date(device.lastReadingAt).toLocaleString()
              : "Sin datos"}
          </Text>
        </View>

        {latestAlert ? (
          <Pressable
            style={styles.alertButton}
            onPress={() => navigation.navigate("Alert", latestAlert)}
          >
            <Text style={styles.alertButtonText}>Ver alerta actual</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f0fdfa" },
  content: { padding: 24, paddingBottom: 40 },
  center: {
    alignItems: "center",
    backgroundColor: "#f0fdfa",
    flex: 1,
    justifyContent: "center",
  },
  kicker: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: { color: "#134e4a", fontSize: 32, fontWeight: "900", marginTop: 8 },
  subtitle: { color: "#475569", fontSize: 16, lineHeight: 23, marginTop: 8 },
  statusPanel: {
    alignItems: "center",
    borderRadius: 20,
    marginTop: 28,
    padding: 28,
  },
  statusLabel: { fontSize: 20, fontWeight: "900", letterSpacing: 1 },
  statusPpm: {
    color: "#0f172a",
    fontSize: 64,
    fontWeight: "900",
    marginTop: 8,
  },
  statusUnit: { color: "#475569", fontSize: 16, fontWeight: "700" },
  infoBlock: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 18,
    padding: 20,
  },
  sectionLabel: { color: "#0f766e", fontSize: 12, fontWeight: "800" },
  deviceName: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
  },
  location: { color: "#334155", fontSize: 17, marginTop: 4 },
  lastReading: { color: "#64748b", fontSize: 13, marginTop: 18 },
  alertButton: {
    alignItems: "center",
    backgroundColor: "#b91c1c",
    borderRadius: 12,
    marginTop: 18,
    padding: 16,
  },
  alertButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
