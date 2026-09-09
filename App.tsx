import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnimatedSplashScreen } from "./src/components/AnimatedSplashScreen";
import { AppNavigator } from "./src/navigation/AppNavigator";

import { APP_ROLE, CO_ALERT_CHANNEL } from "./src/constants/app";
import { navigationRef } from "./src/navigation/AppNavigator";
import { subscribeToAlerts } from "./src/services/alertService";
import { registerPushToken } from "./src/services/pushService";
import type { Alert } from "./src/types/alert";
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

const alertFromNotification = (
  data: Record<string, unknown> | undefined,
): Alert | null => {
  if (data?.type !== "co_alert") return null;

  return {
    id: String(data.id ?? `push-${Date.now()}`),
    deviceId: String(data.device_id ?? "unknown"),
    deviceName: String(data.device_name ?? "Dispositivo"),
    location: String(data.location ?? "Ubicacion no disponible"),
    type: Number(data.co_ppm) >= 80 ? "co_critical" : "co_warning",
    severity: Number(data.co_ppm) >= 80 ? "critical" : "warning",
    coPpm: Number(data.co_ppm),
    message: "Niveles de CO elevados detectados.",
    createdAt: String(data.created_at ?? new Date().toISOString()),
    resolved: false,
  };
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [navigationReady, setNavigationReady] = useState(false);

  // Configurar permisos y canal de Android
  useEffect(() => {
    const configurarNotificaciones = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "VENTO",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });

        await Notifications.setNotificationChannelAsync(CO_ALERT_CHANNEL, {
          name: "Alertas de CO",
          importance: Notifications.AndroidImportance.MAX,

          vibrationPattern: [0, 500, 250, 500],
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
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

          data: {
            type: "co_alert",
            id: alert.id,
            device_id: alert.deviceId,
            device_name: alert.deviceName,
            location: alert.location,
            co_ppm: alert.coPpm,
            created_at: alert.createdAt,
          },
        },
        trigger: { channelId: CO_ALERT_CHANNEL },
      });

      console.log("🔔 Notificación local enviada");
    });

    return unsubscribe;
  }, []);

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

        await registerPushToken(token.data, APP_ROLE);

        console.log("📱 EXPO PUSH TOKEN:", token.data);
      } catch (error) {
        console.error("❌ Error obteniendo Push Token:", error);
      }
    };

    obtenerPushToken();
  }, []);

  useEffect(() => {
    const openAlert = (data: Record<string, unknown> | undefined) => {
      const alert = alertFromNotification(data);

      if (alert && APP_ROLE === "viewer" && navigationRef.isReady()) {
        navigationRef.navigate("Alert", alert);
      }
    };

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        openAlert(response.notification.request.content.data);
      });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      openAlert(response?.notification.request.content.data);
    });

    return () => responseSubscription.remove();
  }, [navigationReady]);

  // Ocultar SplashScreen
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => setNavigationReady(true)}
      >
        <AppNavigator />

        <StatusBar style="auto" />

        {showSplash ? (
          <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />
        ) : null}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
