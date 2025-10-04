import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";

interface BadgeProps {
    label: string;
    backgroundColor?: string;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Badge: React.FC<BadgeProps> = ({
    label,
    backgroundColor = "#9cbe9dff",
    textColor = "#fff",
    style,
    textStyle,
}) => {
    return (
        <View style={[styles.badge, { backgroundColor }, style]}>
            <Text style={[styles.badgeText, { color: textColor }, textStyle]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default Badge;
