import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Alert } from "../types/alert";
import { StatusBadge } from "./StatusBadge";

interface Props {
  alert: Alert;
}

export const AlertCard: React.FC<Props> = ({ alert }) => {
  const getBadgeStatus = () => {
    if (alert.resolved) return "resolved";
    if (alert.severity === "critical") return "alert";
    if (alert.severity === "warning") return "warning";
    return "normal";
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{alert.deviceName}</Text>
        <StatusBadge status={getBadgeStatus()} />
      </View>
      <View style={styles.body}>
        <Text style={styles.location}>📍 {alert.location}</Text>
        <Text style={styles.message}>{alert.message}</Text>
        {alert.coPpm !== undefined && (
          <Text style={styles.coPpm}>CO Medido: {alert.coPpm} ppm</Text>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(alert.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#9ca3af",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  body: {
    marginVertical: 8,
  },
  location: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  message: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },
  coPpm: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b91c1c",
  },
  footer: {
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
