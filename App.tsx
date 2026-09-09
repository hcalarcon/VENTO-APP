import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnimatedSplashScreen } from "./src/components/AnimatedSplashScreen";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { subscribeToAlerts } from "./src/services/alertService";
import { registerPushToken } from "./src/services/pushService";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

// Configuración para mostrar notificaciones
// incluso cuando la app está abierta.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Configurar permisos y canal de Android
  useEffect(() => {
    const configurarNotificaciones = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "VENTO",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();

      console.log("🔔 Permiso notificaciones:", status);
    };

    configurarNotificaciones();
  }, []);

  useEffect(() => {
    console.log("📡 Iniciando suscripción a alertas...");

    const unsubscribe = subscribeToAlerts(async (alert) => {
      console.log("🚨 ALERTA RECIBIDA EN APP:", alert);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🚨 VENTO — Alerta de CO",
          body: `${alert.coPpm} ppm detectados en ${alert.deviceName}`,
          sound: "default",
        },
        trigger: null,
      });

      console.log("🔔 Notificación local enviada");
    });

    return unsubscribe;
  }, []);

  //   const obtenerPushToken = async () => {
  //     try {
  //       const { status } = await Notifications.getPermissionsAsync();

  //       if (status !== "granted") {
  //         console.log("❌ No hay permiso para notificaciones");
  //         return;
  //       }

  //       const projectId =
  //         Constants.expoConfig?.extra?.eas?.projectId ??
  //         Constants.easConfig?.projectId;

  //       console.log("📦 Expo Project ID:", projectId);

  //       if (!projectId) {
  //         console.error("❌ No se encontró el Expo Project ID");
  //         return;
  //       }

  //       const token = await Notifications.getExpoPushTokenAsync({
  //         projectId,
  //       });

  //       console.log("📱 EXPO PUSH TOKEN:", token.data);
  //     } catch (error) {
  //       console.error("❌ Error obteniendo Push Token:", error);
  //     }
  //   };

  //   obtenerPushToken();
  // }, []);

  // Ocultar SplashScreen
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const obtenerPushToken = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();

        if (status !== "granted") {
          console.log("❌ No hay permiso para notificaciones");
          return;
        }

        const projectId = "af2bd92e-6ee1-4421-8161-9169dacb859d";

        console.log("📦 Expo Project ID:", projectId);

        if (!projectId) {
          console.error("❌ No se encontró el Expo Project ID");
          return;
        }

        const token = await Notifications.getExpoPushTokenAsync({
          projectId,
        });

        await registerPushToken(token.data, "owner");

        console.log("📱 EXPO PUSH TOKEN:", token.data);
      } catch (error) {
        console.error("❌ Error obteniendo Push Token:", error);
      }
    };

    obtenerPushToken();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />

        <StatusBar style="auto" />

        {showSplash ? (
          <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />
        ) : null}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
