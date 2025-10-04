import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { BussinessPageProps } from "../../interface/BussinessPageProps";


const BusinessDetailsCard: React.FC<BussinessPageProps> = ({
    address,
    contactNumber,
    email,
    operatingHours,
    website
}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Business Details</Text>
            {address && (
                <DetailRow icon="location-outline" label={address} />
            )}

            {contactNumber && (
                <DetailRow icon="call-outline" label={contactNumber} />
            )}

            {email && (
                <DetailRow icon="mail-outline" label={email} />
            )}

            {operatingHours && (
                <DetailRow icon="time-outline" label={operatingHours} />
            )}

            {website && (
                <TouchableOpacity onPress={() => Linking.openURL(website)}>
                    <DetailRow icon="globe-outline" label={website} isLink />
                </TouchableOpacity>
            )}
        </View>
    );
};

const DetailRow = ({ icon, label, isLink = false }: { icon: string; label: string; isLink?: boolean }) => (
    <View style={styles.detailRow}>
        <Icon name={icon} size={20} color="#007bff" style={styles.icon} />
        <Text style={[styles.detailText, isLink && styles.link]}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginVertical: 32,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
    },
    detailText: {
        fontSize: 15,
        color: "#444",
    },
    link: {
        color: "#007bff",
        textDecorationLine: "underline",
    },
});

export default BusinessDetailsCard;
