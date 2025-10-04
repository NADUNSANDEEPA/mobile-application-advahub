import React, { JSX } from "react";
import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from "react-native";

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    errorMessage?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

const InputField = ({
    label,
    value,
    onChangeText,
    placeholder = "",
    multiline = false,
    errorMessage = "",
    containerStyle,
    inputStyle,
}: InputFieldProps): JSX.Element => (
    <View style={[styles.inputWrapper, containerStyle]}>
        <Text style={styles.inputLabel}>{label}</Text>

        <TextInput
            style={[styles.input, multiline && styles.multiline, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor="rgba(150,150,150,0.8)"
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
);

export default InputField;

const styles = StyleSheet.create({
    inputWrapper: {
        width: "100%",
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#585858ff",
    },
    input: {
        width: "100%",
        backgroundColor: "#f2f2f2",
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: "rgba(204, 204, 204, 0.3)",
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    error: {
        color: "#e53935",
        fontSize: 11,
        marginTop: 4,
    },
});
