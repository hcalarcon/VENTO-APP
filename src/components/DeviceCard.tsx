import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Device } from "../types/device";
import { StatusBadge } from "./StatusBadge";

interface Props {
  device: Device;
  onPress?: () => void;
}

export const DeviceCard: React.FC<Props> = ({ device, onPress }) => {
  const timeAgo = (dateString: string | null) => {
    if (!dateString) {
      return "Sin comunicación";
    }

    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / 1000,
    );

    if (seconds < 60) {
      return `hace ${seconds} segundos`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `hace ${minutes} minutos`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `hace ${hours} horas`;
    }

    return `hace ${Math.floor(hours / 24)} días`;
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{device.name}</Text>

        <StatusBadge status={device.status} />
      </View>

      <View style={styles.body}>
        <Text style={styles.location}>
          📍 {device.location ?? "Sin ubicación"}
        </Text>

        <Text style={styles.coPpm}>
          CO: {device.lastCoPpm !== null ? `${device.lastCoPpm} ppm` : "-- ppm"}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.lastSeen}>
          Última comunicación: {timeAgo(device.lastReadingAt)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 2,
  },

  cardPressed: {
    opacity: 0.7,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },

  body: {
    marginVertical: 8,
  },

  location: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },

  coPpm: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },

  footer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 8,
  },

  lastSeen: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
