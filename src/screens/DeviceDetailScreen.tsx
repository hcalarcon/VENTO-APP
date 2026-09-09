import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBadge } from "../components/StatusBadge";
import { getDeviceById } from "../services/deviceService";
import { getReadingsByDevice } from "../services/readingService";
import type { Device } from "../types/device";
import type { Reading } from "../types/reading";

type RootStackParamList = {
  DeviceDetail: {
    id: string;
  };
};

type DeviceDetailRouteProp = RouteProp<RootStackParamList, "DeviceDetail">;

const screenWidth = Dimensions.get("window").width;

export const DeviceDetailScreen = () => {
  const route = useRoute<DeviceDetailRouteProp>();
  const { id } = route.params;

  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        setError(null);

        const deviceData = await getDeviceById(id);

        if (!deviceData) {
          setError("No se encontró el dispositivo.");
          return;
        }

        const readingsData = await getReadingsByDevice(id);

        setDevice(deviceData);
        setReadings(readingsData);
      } catch (err) {
        console.error("Error cargando dispositivo:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !device) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? "Dispositivo no encontrado."}
        </Text>
      </View>
    );
  }

  const average =
    readings.length > 0
      ? readings.reduce((sum, reading) => sum + reading.coPpm, 0) /
        readings.length
      : 0;

  const maximum =
    readings.length > 0
      ? Math.max(...readings.map((reading) => reading.coPpm))
      : 0;

  const minimum =
    readings.length > 0
      ? Math.min(...readings.map((reading) => reading.coPpm))
      : 0;

  const alertCount = readings.filter((reading) => reading.alert).length;

  // Las lecturas vienen de más reciente a más antigua.
  // Para la gráfica las mostramos en orden cronológico.
  const chartReadings = [...readings].reverse();

  const chartData = {
    labels: chartReadings.map((reading, index) => {
      if (index % 5 !== 0) return "";

      return new Date(reading.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }),

    datasets: [
      {
        data:
          chartReadings.length > 0
            ? chartReadings.map((reading) => reading.coPpm)
            : [0],
        strokeWidth: 3,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom", "top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* CABECERA */}
        <View style={styles.headerCard}>
          <Text style={styles.name}>{device.name}</Text>

          <Text style={styles.location}>
            📍 {device.location ?? "Sin ubicación"}
          </Text>

          <View style={styles.statusRow}>
            <StatusBadge status={device.status} />

            <Text style={styles.coPpm}>
              {device.lastCoPpm !== null ? `${device.lastCoPpm} ppm` : "-- ppm"}
            </Text>
          </View>

          <Text style={styles.lastSeen}>
            Última comunicación:{" "}
            {device.lastReadingAt
              ? new Date(device.lastReadingAt).toLocaleString()
              : "Sin datos"}
          </Text>
        </View>

        {/* GRÁFICA */}
        <Text style={styles.subtitle}>Nivel de CO</Text>

        <View style={styles.chartCard}>
          {chartReadings.length === 0 ? (
            <Text style={styles.placeholderText}>
              No hay suficientes lecturas para mostrar la gráfica.
            </Text>
          ) : (
            <>
              <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={240}
                yAxisSuffix=" ppm"
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: () => "#2563eb",
                  labelColor: () => "#6b7280",
                  propsForDots: {
                    r: "3",
                    strokeWidth: "1",
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: "",
                  },
                }}
                bezier
                fromZero
                style={styles.chart}
              />

              <Text style={styles.chartDescription}>
                Últimas {chartReadings.length} lecturas
              </Text>
            </>
          )}
        </View>

        {/* ESTADÍSTICAS */}
        <Text style={styles.subtitle}>Estadísticas del dispositivo</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{average.toFixed(1)} ppm</Text>

            <Text style={styles.statLabel}>Promedio</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{maximum} ppm</Text>

            <Text style={styles.statLabel}>Máximo</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{minimum} ppm</Text>

            <Text style={styles.statLabel}>Mínimo</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{alertCount}</Text>

            <Text style={styles.statLabel}>Alertas</Text>
          </View>
        </View>

        {/* HISTORIAL */}
        <Text style={styles.subtitle}>Historial de CO</Text>

        <View style={styles.readingsCard}>
          {readings.length === 0 ? (
            <Text style={styles.placeholderText}>
              No hay lecturas registradas.
            </Text>
          ) : (
            readings.map((reading) => (
              <View key={reading.id} style={styles.readingRow}>
                <View>
                  <Text style={styles.readingValue}>{reading.coPpm} ppm</Text>

                  <Text style={styles.readingDate}>
                    {new Date(reading.createdAt).toLocaleString()}
                  </Text>
                </View>

                {reading.alert && (
                  <Text style={styles.alertText}>⚠️ ALERTA</Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },

  errorText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },

  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 2,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },

  location: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 16,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  coPpm: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#374151",
  },

  lastSeen: {
    fontSize: 14,
    color: "#9ca3af",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },

  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 24,
    overflow: "hidden",
  },

  chart: {
    marginVertical: 4,
    borderRadius: 12,
  },

  chartDescription: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },

  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },

  statLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },

  readingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
  },

  readingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  readingValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  readingDate: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },

  alertText: {
    fontWeight: "600",
    color: "#dc2626",
  },

  placeholderText: {
    color: "#6b7280",
    textAlign: "center",
    padding: 24,
  },
});
