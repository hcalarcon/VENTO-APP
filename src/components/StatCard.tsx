import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  color = "#2563eb",
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 10,
    flex: 1,
    margin: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "center",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
});
