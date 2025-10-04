import React, { JSX } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface TopBarProps {
    title: string;
    onNotificationPress?: () => void;
    onPageIconPress?: () => void;
}

export default function TopBar({ title, onNotificationPress, onPageIconPress }: TopBarProps): JSX.Element {
    return (
        <View style={styles.topBar}>
            {/* Left: App Name */}
            <View style={styles.logoContainer}>
                <Text style={styles.centerText}>{title}</Text>
            </View>

            {/* Right: Icons */}
            <View style={styles.rightIcons}>
                <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
                    <Icon name="notifications-outline" size={26} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPageIconPress} style={styles.iconButton}>
                    <Icon name="document-text-outline" size={26} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    logoContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    centerText: {
        fontSize: 23,
        fontWeight: "bold",
    },
    rightIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconButton: {
        marginLeft: 16,
    },
});
