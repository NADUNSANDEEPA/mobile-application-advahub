// components/Text/SectionTitle.tsx
import React, { JSX } from "react";
import { View, Text, StyleSheet, TextStyle, ViewStyle } from "react-native";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export default function SectionTitle({
  title,
  subtitle,
  containerStyle,
  titleStyle,
  subtitleStyle,
}: SectionTitleProps): JSX.Element {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#232323ff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#36454F",
    textAlign: "center",
  },
});
