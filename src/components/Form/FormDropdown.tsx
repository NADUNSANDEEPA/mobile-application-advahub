import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GlassView } from "expo-glass-effect";

interface AppDropdownProps {
  label?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: string[];
  glass?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function FormDropdown({
  label,
  selectedValue,
  onValueChange,
  items,
  glass = false,
  style,
}: AppDropdownProps) {
  const PickerComponent = (
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={glass ? styles.glassPicker : styles.picker}
      dropdownIconColor={glass ? "#fff" : "#333"}
    >
      {items.map((item, index) => (
        <Picker.Item key={index} label={item} value={item} />
      ))}
    </Picker>
  );

  return (
    <View style={[{ marginBottom: 15 }, style]}>
      {label && label !== "false" && <Text style={styles.label}>{label}</Text>}
      {glass ? (
        <GlassView style={styles.glassContainer}>{PickerComponent}</GlassView>
      ) : (
        <View style={styles.dropdownWrapper}>{PickerComponent}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#585858ff",
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "rgba(204, 204, 204, 0.6)",
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    height: 45,
    justifyContent: "center",
  },
  picker: {
    color: "#333",
    width: "100%",
    height: 60,
  },
  glassContainer: {
    borderRadius: 8,
    borderWidth: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
    height: 405,
    justifyContent: "center",
  },
  glassPicker: {
    color: "#fff",
    width: "100%",
    height: 45,
  },
});
