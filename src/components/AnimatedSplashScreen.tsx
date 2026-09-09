import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

type AnimatedSplashScreenProps = { onFinish: () => void };

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const logoScale = useRef(new Animated.Value(0.72)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.78)).current;
  const ringOpacity = useRef(new Animated.Value(0.55)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ringAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(ringScale, {
            toValue: 1.18,
            duration: 1800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(ringScale, {
            toValue: 0.78,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 1800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.55,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        damping: 12,
        stiffness: 90,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    ringAnimation.start();

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 450,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: -18,
          duration: 450,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) onFinish();
      });
    }, 1900);

    return () => {
      clearTimeout(exitTimer);
      ringAnimation.stop();
    };
  }, [
    contentOpacity,
    contentTranslateY,
    logoOpacity,
    logoScale,
    onFinish,
    ringOpacity,
    ringScale,
  ]);

  return (
    <Animated.View
      pointerEvents={isExiting ? "none" : "auto"}
      style={[styles.container, { opacity: contentOpacity }]}
    >
      <View style={styles.glow} />
      <Animated.View
        style={[
          styles.ring,
          { opacity: ringOpacity, transform: [{ scale: ringScale }] },
        ]}
      />
      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateY: contentTranslateY }] },
        ]}
      >
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require("../../assets/images/splash-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={styles.title}>VENTO</Text>
        <Text style={styles.subtitle}>control inteligente, sin ruido</Text>
        <View style={styles.loadingTrack}>
          <View style={styles.loadingBar} />
        </View>
      </Animated.View>
      <Text style={styles.version}>MONITOREO EN TIEMPO REAL</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    backgroundColor: "#07111F",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 10,
  },
  glow: {
    backgroundColor: "#1265C7",
    borderRadius: 260,
    height: 360,
    opacity: 0.2,
    position: "absolute",
    width: 360,
  },
  ring: {
    borderColor: "#5CE1E6",
    borderRadius: 180,
    borderWidth: 1,
    height: 280,
    position: "absolute",
    width: 280,
  },
  content: { alignItems: "center" },
  logoWrap: {
    alignItems: "center",
    backgroundColor: "#1597D4",
    borderColor: "rgba(151, 243, 242, 0.55)",
    borderRadius: 36,
    borderWidth: 1,
    elevation: 12,
    height: 94,
    justifyContent: "center",
    shadowColor: "#5CE1E6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 22,
    width: 94,
  },
  logo: { height: 52, width: 52 },
  title: {
    color: "#F4FBFF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 8,
    marginLeft: 8,
    marginTop: 28,
  },
  subtitle: {
    color: "#9BE8EA",
    fontSize: 13,
    letterSpacing: 1.1,
    marginTop: 9,
  },
  loadingTrack: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 3,
    height: 4,
    marginTop: 34,
    overflow: "hidden",
    width: 116,
  },
  loadingBar: {
    backgroundColor: "#5CE1E6",
    borderRadius: 3,
    height: "100%",
    width: "70%",
  },
  version: {
    bottom: 44,
    color: "rgba(207, 245, 246, 0.62)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2.2,
    position: "absolute",
  },
});
