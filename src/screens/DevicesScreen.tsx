import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DeviceCard } from "../components/DeviceCard";
import { getDevices } from "../services/deviceService";
import type { Device } from "../types/device";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  DevicesList: undefined;
  DeviceDetail: { id: string };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DevicesList"
>;

export const DevicesScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getDevices();

        setDevices(data);
      } catch (err) {
        console.error("ERROR CARGANDO DISPOSITIVOS:", err);

        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar los dispositivos.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Cargando dispositivos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error cargando dispositivos</Text>

        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onPress={() =>
              navigation.navigate("DeviceDetail", {
                id: item.id,
              })
            }
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No hay dispositivos registrados.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  list: {
    padding: 16,
    flexGrow: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  text: {
    marginTop: 10,
    textAlign: "center",
  },

  error: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
});
