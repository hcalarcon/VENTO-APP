import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Alert } from "../types/alert";

export type AlertScreenParams = Alert;

type ViewerStackParamList = {
  Monitor: undefined;
  Alert: AlertScreenParams;
};

type AlertRoute = ReturnType<typeof useRoute<any>> & {
  params: AlertScreenParams;
};

export const AlertScreen = () => {
  const route = useRoute<AlertRoute>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ViewerStackParamList>>();
  const alert = route.params;
  const critical = alert.severity === "critical";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.signal,
            critical ? styles.signalCritical : styles.signalWarning,
          ]}
        >
          <Text style={styles.signalIcon}>{critical ? "!" : "i"}</Text>
        </View>

        <Text style={styles.eyebrow}>VENTO / MONITOREO</Text>
        <Text style={styles.title}>ALERTA DE CO</Text>
        <Text style={styles.severity}>{critical ? "PELIGRO" : "ATENCION"}</Text>

        <View style={styles.readingPanel}>
          <Text style={styles.reading}>{alert.coPpm ?? "--"}</Text>
          <Text style={styles.unit}>ppm</Text>
        </View>

        <View style={styles.details}>
          <Detail label="Dispositivo" value={alert.deviceName} />
          <Detail label="Ubicacion" value={alert.location} />
          <Detail
            label="Ocurrio"
            value={new Date(alert.createdAt).toLocaleString()}
          />
        </View>

        <Text style={styles.message}>{alert.message}</Text>
        <Text style={styles.instruction}>
          Verifica el ambiente y alejate de la zona si corresponde.
        </Text>

        <Text
          style={styles.back}
          onPress={() => navigation.navigate("Monitor")}
        >
          Volver al monitoreo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detail}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff7ed" },
  content: { padding: 24, paddingBottom: 40 },
  signal: {
    alignItems: "center",
    borderRadius: 48,
    height: 88,
    justifyContent: "center",
    marginBottom: 24,
    width: 88,
  },
  signalCritical: { backgroundColor: "#dc2626" },
  signalWarning: { backgroundColor: "#ca8a04" },
  signalIcon: { color: "#fff", fontSize: 56, fontWeight: "900" },
  eyebrow: {
    color: "#9a3412",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: { color: "#7f1d1d", fontSize: 34, fontWeight: "900", marginTop: 8 },
  severity: { color: "#b91c1c", fontSize: 18, fontWeight: "800", marginTop: 6 },
  readingPanel: {
    alignItems: "baseline",
    flexDirection: "row",
    marginVertical: 28,
  },
  reading: { color: "#111827", fontSize: 68, fontWeight: "900" },
  unit: { color: "#7f1d1d", fontSize: 22, fontWeight: "700", marginLeft: 8 },
  details: { borderTopColor: "#fed7aa", borderTopWidth: 1, marginBottom: 24 },
  detail: {
    borderBottomColor: "#fed7aa",
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  detailLabel: {
    color: "#9a3412",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  detailValue: {
    color: "#431407",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  message: {
    color: "#431407",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  instruction: { color: "#7c2d12", fontSize: 16, lineHeight: 24 },
  back: { color: "#9a3412", fontSize: 16, fontWeight: "800", marginTop: 32 },
});
