import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertCard } from "../components/AlertCard";
import { StatCard } from "../components/StatCard";
import { getActiveAlerts } from "../services/alertService";
import { getStatistics } from "../services/statisticsService";
import type { Alert } from "../types/alert";
import type { Statistics } from "../types/statistics";

export const HomeScreen = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsData, alertsData] = await Promise.all([
          getStatistics(),
          getActiveAlerts(),
        ]);

        setStats({
          ...statsData,
          totalAlerts: statsData.activeAlerts,
          averageCoPpm: 0,
          maxCoPpm: 0,
        });
        setAlerts(alertsData.slice(0, 3));
      } catch (error) {
        console.error("Error cargando Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Estado General</Text>

        <View style={styles.row}>
          <StatCard
            title="Dispositivos"
            value={stats.totalDevices}
            color="#374151"
          />

          <StatCard
            title="Online"
            value={stats.onlineDevices}
            color="#16a34a"
          />
        </View>

        <View style={styles.row}>
          <StatCard
            title="Offline"
            value={stats.offlineDevices}
            color="#6b7280"
          />

          <StatCard
            title="Alertas Activas"
            value={stats.activeAlerts}
            color="#dc2626"
          />
        </View>

        <Text style={styles.subtitle}>Resumen de Dispositivos</Text>

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

        <Text style={styles.subtitle}>Últimas Alertas</Text>

        {alerts.length === 0 ? (
          <Text style={styles.emptyText}>No hay alertas recientes.</Text>
        ) : (
          alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
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
    marginTop: 24,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 5,
  },

  emptyText: {
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 16,
  },
});
