import React, { JSX } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  DimensionValue,
  ColorValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

interface FormButtonProps {
  title: string;
  onPress: () => void;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  width?: DimensionValue; // ✅ supports number or % string
  height?: DimensionValue;
  borderRadius?: number;
  borderColor?: ColorValue;
  borderWidth?: number;
  gradientColors?: [ColorValue, ColorValue, ...ColorValue[]]; // ✅ tuple ensures at least 2 colors
}

export default function FormButton({
  title,
  onPress,
  iconName,
  iconSize = 20,
  iconColor = "white",
  width = "80%",
  height = 50,
  borderRadius = 30,
  borderColor = "transparent",
  borderWidth = 0,
  gradientColors = ["#1D252A", "#1D252A"],
}: FormButtonProps): JSX.Element {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          { width, height, borderRadius, borderColor, borderWidth },
        ]}
      >
        <View style={styles.content}>
          {iconName && (
            <FontAwesome
              name={iconName as any}
              size={iconSize}
              color={iconColor}
              style={styles.icon}
            />
          )}
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 8,
  },
});
