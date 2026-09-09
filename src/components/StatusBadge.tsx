import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DeviceStatus } from "../types/device";

interface Props {
  status: DeviceStatus | "resolved";
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "normal":
        return { bg: "#dcfce7", text: "#166534", label: "Normal" };
      case "warning":
        return { bg: "#fef08a", text: "#854d0e", label: "Advertencia" };
      case "alert":
        return { bg: "#fee2e2", text: "#991b1b", label: "Alerta" };
      case "offline":
        return { bg: "#f3f4f6", text: "#374151", label: "Offline" };
      case "resolved":
        return { bg: "#e0e7ff", text: "#3730a3", label: "Resuelta" };
      default:
        return { bg: "#f3f4f6", text: "#374151", label: status };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
