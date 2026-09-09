# VENTO-APP

Aplicación móvil para el monitoreo de dispositivos VENTO destinados a la detección de monóxido de carbono (CO).

Proyecto desarrollado en el marco de **EducaTIC 2026**.

---

## 📱 Descripción

VENTO permite monitorear dispositivos sensores de CO conectados a Internet mediante ESP32.

Los dispositivos envían periódicamente sus mediciones a **Supabase**, donde se almacenan las lecturas y el estado de alerta.

La aplicación permite:

* Visualizar dispositivos registrados.
* Consultar el estado de cada dispositivo.
* Ver las últimas mediciones de CO.
* Consultar gráficos históricos.
* Visualizar estadísticas generales.
* Consultar alertas.
* Recibir notificaciones cuando se detecta una concentración peligrosa de CO.

---

## 🏗️ Tecnologías

* React Native
* Expo
* TypeScript
* React Navigation
* Supabase
* Supabase Realtime
* `expo-notifications`
* React Native Chart Kit
* ESP32 / sensores de CO

---

## 🗄️ Backend

VENTO utiliza Supabase como backend.

Actualmente se utilizan principalmente las tablas:

### `devices`

Registra los dispositivos VENTO.

```text
id
name
location
device_token
enabled
last_reading_at
created_at
```

### `lecturas`

Registra las mediciones enviadas por los dispositivos.

```text
id
device_id
co_ppm
created_at
alert
```

Una lectura con:

```text
alert = true
```

se considera una alerta de CO.

---

## 🚨 Sistema de alertas

El sistema utiliza **Supabase Realtime** para detectar nuevas lecturas con `alert = true`.

Flujo actual:

```text
ESP32
  ↓
Supabase
  ↓
lecturas
  ↓
Supabase Realtime
  ↓
VENTO-APP
  ↓
Notificación local
```

Las notificaciones fueron probadas correctamente con la aplicación:

* En primer plano ✅
* En segundo plano ✅

Actualmente las notificaciones locales no funcionan cuando el proceso de la aplicación es completamente cerrado.

La implementación de **push notifications remotas** queda prevista para una versión futura.

---

## 📊 V0.1 — Estado actual

La versión 0.1 se considera funcional.

Incluye:

* Lista de dispositivos.
* Estado online/offline.
* Detalle de dispositivo.
* Mediciones de CO.
* Gráfico histórico.
* Estadísticas por dispositivo.
* Estadísticas generales.
* Gráfico de evolución de CO.
* Gráfico de alertas.
* Distribución de estados.
* Alertas reales desde Supabase.
* Notificaciones en primer y segundo plano.

### Estado online

Un dispositivo se considera online cuando existe una lectura reciente.

Actualmente se utiliza un límite de:

```text
30 segundos
```

Como los ESP32 envían una lectura aproximadamente cada 10 segundos, este margen permite detectar correctamente dispositivos desconectados.

---

## 👥 V0.2 — Próxima etapa

La V0.2 incorporará un sistema simple de roles para la demostración.

No se utilizará autenticación todavía.

Habrá dos variantes de la aplicación:

### OWNER

Versión completa de VENTO.

```text
APP_ROLE = "owner"
```

Se utilizará en uno o dos teléfonos principales.

Tendrá acceso a las funciones completas del sistema.

### VIEWER

Versión simplificada para alumnos y otros usuarios.

```text
APP_ROLE = "viewer"
```

El Viewer:

* Puede visualizar todos los dispositivos.
* Puede consultar el estado general.
* Puede visualizar las mediciones.
* Recibe las alertas.
* No tiene funciones administrativas.

No existe una relación entre una persona y un dispositivo.

Un Viewer puede visualizar **todos los dispositivos existentes en el sistema**.

Ejemplo:

```text
                    VENTO
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     VENTO-01      VENTO-02      VENTO-03
        │             │             │
        └─────────────┼─────────────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
          OWNER             VIEWERS
```

Esto permite agregar nuevos dispositivos sin tener que asociarlos individualmente con cada usuario.

---

## 🔔 Alarma visual para Viewer

La versión Viewer tendrá una interfaz orientada principalmente al monitoreo.

Cuando se detecte una alerta mientras la aplicación está abierta, además de la notificación se mostrará una alarma visual destacada.

Conceptualmente:

```text
🚨 ALERTA DE CO 🚨

115.4 ppm

Dispositivo:
VENTO-01

Niveles peligrosos detectados.
```

También se podrá utilizar sonido y vibración.

Cuando la aplicación esté en segundo plano, se utilizará el sistema de notificaciones.

---

## 🔐 Autenticación

La autenticación con usuarios reales **no forma parte de V0.2**.

Para la demostración se utilizará un rol definido durante la compilación:

```text
OWNER
```

o:

```text
VIEWER
```

En una versión futura se podrá reemplazar este mecanismo por:

```text
Supabase Auth
      ↓
Usuario
      ↓
Rol
```

sin modificar el concepto general del sistema.

---

## 🔮 V0.3 — Futuras mejoras

Entre las mejoras previstas:

* Push notifications remotas.
* Notificaciones cuando la aplicación está completamente cerrada.
* Autenticación de usuarios.
* Sistema real de roles.
* Gestión de personas.
* Mejoras en la administración de dispositivos.
* Posible registro de usuarios autorizados.
* Mejoras en el sistema de alertas.

---

## 📁 Estructura principal

```text
src/
├── components/
├── constants/
├── hooks/
├── lib/
├── mocks/
├── navigation/
├── screens/
├── services/
└── types/
```

### Servicios principales

```text
deviceService.ts
readingService.ts
alertService.ts
statisticsService.ts
```

Estos servicios centralizan el acceso a Supabase y mantienen separada la lógica de datos de las pantallas.

---

## ▶️ Desarrollo

Instalar dependencias:

```bash
npm install
```

Ejecutar el proyecto:

```bash
npx expo start
```

Para ejecutar Android:

```bash
npx expo run:android
```

---

## 📦 Compilaciones

La aplicación se prepara para generar diferentes variantes según el rol:

```text
VENTO OWNER
    ↓
Aplicación completa

VENTO VIEWER
    ↓
Aplicación simplificada para monitoreo
```

Ambas variantes utilizan el mismo backend de Supabase.

---

## 🎓 EducaTIC 2026

VENTO forma parte de un proyecto educativo orientado a demostrar el uso conjunto de:

```text
Sensores
   ↓
ESP32
   ↓
Wi-Fi
   ↓
Supabase
   ↓
Realtime
   ↓
Aplicación móvil
   ↓
Alertas
```

El objetivo es demostrar un sistema de detección y comunicación de riesgos de monóxido de carbono en ambientes cerrados.
