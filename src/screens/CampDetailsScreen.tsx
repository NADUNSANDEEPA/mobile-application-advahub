import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { LightColors, DarkColors } from "../theme/Colors";

export default function CampDetailsScreen() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkColors : LightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text]}>
        Nadun Camp Details will go here.........
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 18 , color: "#333" },
});
