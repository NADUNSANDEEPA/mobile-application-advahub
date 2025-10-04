import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GlassView } from "expo-glass-effect";

interface AppDropdownProps {
    label?: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    items: string[];
    glass?: boolean;
}

export default function AppDropdown({
    label,
    selectedValue,
    onValueChange,
    items,
    glass = false,
}: AppDropdownProps) {
    const [open, setOpen] = useState(false);

    const PickerComponent = (
        <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.picker}
            dropdownIconColor="#fff"
        >
            {items.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
            ))}
        </Picker>
    );

    return (
        <View style={{ marginBottom: 15 }}>
            {label && label != 'false' && <Text style={styles.label}>{label}</Text>}
            {glass ? (
                <GlassView style={styles.glassContainer}>{PickerComponent}</GlassView>
            ) : (
                PickerComponent
            )}
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
    glassContainer: {
        borderRadius: 8,
        borderWidth: 0,
        borderColor: "rgba(255,255,255,0.3)",
        backgroundColor: "rgba(255,255,255,0.1)",
        overflow: "hidden",
        height: 43,
        justifyContent: "center",
    },

    picker: {
        color: "#fff",
        height: 100,
        fontSize: 16
    }
});
