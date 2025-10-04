import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ImageBackground,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LightColors, DarkColors } from "../theme/Colors";
import useCurrentCountry from "../utils/CurrentCountry";
import { jwtDecode } from "jwt-decode";
import { USER_LOCATION_CACHINNG_KEY, USER_TOKEN_CACHINNG_KEY } from "../../config";
import { getItemAsyncStorage, saveItemAsyncStorage } from "../utils/AsyncStorageService";

export default function LoadingPage({ navigation }: any) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkColors : LightColors;
  const { country, location } = useCurrentCountry();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const initApp = async () => {
      if (country && location) {
        await saveItemAsyncStorage(USER_LOCATION_CACHINNG_KEY, { location, country });
      }

      try {
        const token = await getItemAsyncStorage(USER_TOKEN_CACHINNG_KEY);
        if (token) {
          const decodedToken: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp && decodedToken.exp > currentTime) {
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
            return;
          }
        }
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      } catch (error) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    };

    setTimeout(() => {
      initApp();
    }, 3000);
  }, [country, location]);

  return (
    <ImageBackground
      source={require("../../assets/bg-img.webp")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.6)", "rgba(1,42,31,1)"]}
        style={styles.overlay}
      >
        <Animated.View
          style={[
            styles.topLeftLogoContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.leftAlignedTextContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={[styles.subtitle, { color: "#eef7deff" }]}>Explore Beyond Limits</Text>
          <Text
            style={[
              styles.title,
              {
                color: "#b8ce91ff",
                fontSize: 28,
                marginBottom: 70,
                lineHeight: 30,
              },
            ]}
          >
            Find. Explore. Conquer.
          </Text>

        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, justifyContent: "center" },
  topLeftLogoContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
  },
  logo: { width: 130, height: 130 },
  subtitle: {
    fontSize: 15,
    fontWeight: "300",
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontWeight: "800",
    textAlign: "left",
    letterSpacing: 2,
    lineHeight: 54,
  },
  leftAlignedTextContainer: {
    flex: 1,
    justifyContent: "flex-end", 
    alignItems: "flex-start",   
    paddingLeft: 30,
    paddingBottom: 40,        
  }
});
