import React from "react";
import { TextInput, StyleSheet, TextInputProps, View, Text } from "react-native";
import { GlassView } from "expo-glass-effect";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  glass?: boolean;
}

export default function AppInput({
  label,
  error,
  glass = false,
  style,
  ...props
}: AppInputProps) {
  const InputField = (
    <TextInput
      style={[glass ? styles.glassInput : styles.input, style]}
      placeholderTextColor="#999"
      {...props}
    />
  );

  return (
    <View style={{ marginBottom: 15 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      {glass ? <GlassView style={styles.glassContainer}>{InputField}</GlassView> : InputField}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#fff",
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    color: "#fff",
  },
  glassContainer: {
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  glassInput: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#fff",
  },
  error: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: 5,
  },
});
