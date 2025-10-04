import React, { JSX } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

interface TabItem {
  name: string;
  icon: string;
}

interface BottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomBar({ activeTab, setActiveTab }: BottomBarProps): JSX.Element {
  const insets = useSafeAreaInsets();

  const tabs: TabItem[] = [
    { name: "Home", icon: "home-outline" },
    { name: "Scan", icon: "camera-outline" },
    { name: "Favourites", icon: "heart-outline" },
    { name: "Profile", icon: "person-outline" },
  ];

  return (
    <>
      {/* Soft Navigation Background */}
      <LinearGradient
        colors={["white", "white"]}
        style={[styles.navigationGradient, { height: insets.bottom }]}
      />

      {/* Floating Bottom Bar */}
      <LinearGradient
        colors={["rgba(0,0,0,1)", "rgba(1,42,31,1)", "rgba(1,42,31,1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.bottomBar, { bottom: 16 + insets.bottom }]}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.name}
            style={({ pressed }) => [styles.iconContainer, pressed && { opacity: 0.6 }]}
            android_ripple={{ color: "rgba(255,255,255,0.3)", borderless: true }}
            onPress={() => setActiveTab(tab.name)}
          >
            <Icon name={tab.icon} size={24} color="white" />
            <Text style={styles.iconText}>{tab.name}</Text>
          </Pressable>
        ))}
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  navigationGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomBar: {
    flexDirection: "row",
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    borderRadius: 30,
  },
  iconText: {
    color: "white",
    fontSize: 10,
    marginTop: 2,
  },
});
