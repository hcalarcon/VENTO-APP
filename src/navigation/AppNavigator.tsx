import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AlertsScreen } from "../screens/AlertsScreen";
import { DeviceDetailScreen } from "../screens/DeviceDetailScreen";
import { DevicesScreen } from "../screens/DevicesScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { StatisticsScreen } from "../screens/StatisticsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DevicesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DevicesList"
        component={DevicesScreen}
        options={{ title: "Dispositivos" }}
      />
      <Stack.Screen
        name="DeviceDetail"
        component={DeviceDetailScreen}
        options={{ title: "Detalle del Dispositivo" }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Devices"
        component={DevicesStack}
        options={{
          title: "Dispositivos",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hardware-chip-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          title: "Alertas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: "Estadísticas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
