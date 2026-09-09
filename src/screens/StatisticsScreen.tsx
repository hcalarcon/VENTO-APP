import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatCard } from "../components/StatCard";
import { getStatistics } from "../services/statisticsService";
import type { Statistics } from "../types/statistics";

const screenWidth = Dimensions.get("window").width;

type StatisticsData = Statistics & {
  coHistory: {
    value: number;
    createdAt: string;
  }[];

  alertsByDay: {
    date: string;
    count: number;
  }[];
};

export const StatisticsScreen = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getStatistics();

        setStats(data);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !stats) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error ?? "No hay estadísticas disponibles."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // GRÁFICO HISTORIAL CO
  // =========================

  const historyLabels = stats.coHistory.map((reading, index) => {
    if (index % 5 !== 0) {
      return "";
    }

    return new Date(reading.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  const historyData = {
    labels: historyLabels,
    datasets: [
      {
        data:
          stats.coHistory.length > 0
            ? stats.coHistory.map((reading) => reading.value)
            : [0],
        strokeWidth: 3,
      },
    ],
  };

  // =========================
  // GRÁFICO ALERTAS POR DÍA
  // =========================

  const alertsChartData = {
    labels:
      stats.alertsByDay.length > 0
        ? stats.alertsByDay.map((item) => item.date)
        : ["Sin datos"],

    datasets: [
      {
        data:
          stats.alertsByDay.length > 0
            ? stats.alertsByDay.map((item) => item.count)
            : [0],
      },
    ],
  };

  // =========================
  // GRÁFICO ESTADO
  // =========================

  const deviceStatusData = [
    {
      name: "Normales",
      value: stats.normalDevices,
      color: "#16a34a",
      legendFontColor: "#374151",
      legendFontSize: 12,
    },
    {
      name: "Advertencia",
      value: stats.warningDevices,
      color: "#ca8a04",
      legendFontColor: "#374151",
      legendFontSize: 12,
    },
    {
      name: "Alerta",
      value: stats.alertDevices,
      color: "#dc2626",
      legendFontColor: "#374151",
      legendFontSize: 12,
    },
    {
      name: "Offline",
      value: stats.offlineDevices,
      color: "#6b7280",
      legendFontColor: "#374151",
      legendFontSize: 12,
    },
  ].filter((item) => item.value > 0);

  // =========================
  // RENDER
  // =========================

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Resumen del Sistema</Text>

        {/* =======================
            RESUMEN
        ======================= */}

        <View style={styles.row}>
          <StatCard
            title="Total Disp."
            value={stats.totalDevices}
            color="#374151"
          />

          <StatCard
            title="Online"
            value={stats.onlineDevices}
            color="#16a34a"
          />

          <StatCard
            title="Offline"
            value={stats.offlineDevices}
            color="#4b5563"
          />
        </View>

        <View style={styles.row}>
          <StatCard
            title="Alertas Totales"
            value={stats.totalAlerts}
            color="#374151"
          />

          <StatCard
            title="Alertas Activas"
            value={stats.activeAlerts}
            color="#dc2626"
          />
        </View>

        <View style={styles.row}>
          <StatCard
            title="Promedio CO"
            value={`${stats.averageCoPpm.toFixed(1)} ppm`}
            color="#ca8a04"
          />

          <StatCard
            title="Máximo CO"
            value={`${stats.maxCoPpm} ppm`}
            color="#b91c1c"
          />
        </View>

        {/* =======================
            ESTADO
        ======================= */}

        <Text style={styles.subtitle}>Estado de dispositivos</Text>

        <View style={styles.row}>
          <StatCard
            title="Normales"
            value={stats.normalDevices}
            color="#16a34a"
          />

          <StatCard
            title="Advertencia"
            value={stats.warningDevices}
            color="#ca8a04"
          />

          <StatCard title="Alerta" value={stats.alertDevices} color="#dc2626" />
        </View>

        {/* =======================
            HISTORIAL CO
        ======================= */}

        <Text style={styles.subtitle}>Historial de CO</Text>

        <View style={styles.chartCard}>
          {stats.coHistory.length === 0 ? (
            <Text style={styles.emptyText}>No hay lecturas disponibles.</Text>
          ) : (
            <>
              <LineChart
                data={historyData}
                width={screenWidth - 32}
                height={240}
                yAxisSuffix=" ppm"
                fromZero
                bezier
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
                style={styles.chart}
              />

              <Text style={styles.chartDescription}>
                Últimas {stats.coHistory.length} lecturas
              </Text>
            </>
          )}
        </View>

        {/* =======================
            ALERTAS POR DÍA
        ======================= */}

        <Text style={styles.subtitle}>Alertas por día</Text>

        <View style={styles.chartCard}>
          {stats.alertsByDay.length === 0 ? (
            <Text style={styles.emptyText}>No hay alertas registradas.</Text>
          ) : (
            <BarChart
              data={alertsChartData}
              width={screenWidth - 32}
              height={240}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showValuesOnTopOfBars
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: () => "#dc2626",
                labelColor: () => "#6b7280",
                barPercentage: 0.6,
              }}
              style={styles.chart}
            />
          )}
        </View>

        {/* =======================
            ESTADO DE DISPOSITIVOS
        ======================= */}

        <Text style={styles.subtitle}>Distribución de dispositivos</Text>

        <View style={styles.chartCard}>
          {deviceStatusData.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay dispositivos registrados.
            </Text>
          ) : (
            <PieChart
              data={deviceStatusData}
              width={screenWidth - 32}
              height={240}
              chartConfig={{
                color: () => "#374151",
                labelColor: () => "#374151",
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
              absolute
            />
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
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 20,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },

  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 8,
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
    marginBottom: 8,
  },

  emptyText: {
    color: "#6b7280",
    textAlign: "center",
    padding: 32,
  },
});
