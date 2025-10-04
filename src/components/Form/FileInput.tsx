import React, { JSX, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Pressable, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

interface FileInputProps {
    label: string;
    imageUri: string | null;
    customerId: string;
    type: string;
    onUploaded: (url: string) => void;
    recommendedSize?: string;
    recommendedDimensions?: string;
    buttonWidth?: number | string;
    buttonHeight?: number;
    buttonBorderRadius?: number;
    buttonBorderWidth?: number;
    buttonBorderColor?: string;
    buttonBackgroundColor?: string;
    recommendationAlign?: "left" | "center" | "right";
}

export default function FileInput({
    label,
    imageUri,
    customerId,
    type,
    onUploaded,
    recommendedSize = "Max 2MB",
    recommendedDimensions = "800x600px",
    buttonWidth,
    buttonHeight = 40,
    buttonBorderRadius = 5,
    buttonBorderWidth = 0,
    buttonBorderColor = "#000",
    buttonBackgroundColor = "#425561",
    recommendationAlign = "left",
}: FileInputProps): JSX.Element {
    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            uploadToCloudinary(uri);
        }
    };

    const uploadToCloudinary = async (uri: string) => {
        try {
            setUploading(true);
            const data = new FormData();
            data.append("file", {
                uri,
                type: "image/jpeg",
                name: "upload.jpg",
            } as any);
            data.append("upload_preset", "qfi2jn9c");
            data.append("folder", `advahub/${customerId}/${type}`);

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/nadun/image/upload",
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const url = response.data.secure_url;
            onUploaded(url);
            console.log("Upload successful:", url);
            alert(`${label} uploaded successfully!`);
        } catch (error) {
            console.log(error);
            alert(`Failed to upload ${label}`);
        } finally {
            setUploading(false);
        }
    };

    // Calculate button width in case user provides a number or wants full width
    const screenWidth = Dimensions.get("window").width;
    const btnWidth = typeof buttonWidth === "number" ? buttonWidth : screenWidth - 20;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        width: btnWidth,
                        height: buttonHeight,
                        borderRadius: buttonBorderRadius,
                        borderWidth: buttonBorderWidth,
                        borderColor: buttonBorderColor,
                        backgroundColor: buttonBackgroundColor,
                    },
                ]}
                onPress={pickImage}
            >
                <Text style={styles.buttonText}>
                    {uploading ? "Uploading..." : imageUri ? "Change Image" : "Upload Image"}
                </Text>
            </TouchableOpacity>

            {/* Optional image preview */}
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: 150, height: 150, borderRadius: 8, marginTop: 8 }}
                />
            )}

            {/* Tap to view uploaded image */}
            {imageUri && (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text
                        style={{
                            color: "#007BFF",
                            fontSize: 13,
                            textAlign: "center",
                            marginBottom: 4,
                            marginTop: 4,
                        }}
                    >
                        Tap to view uploaded image
                    </Text>
                </TouchableOpacity>
            )}

            <Text
                style={[
                    styles.recommendation,
                    { textAlign: recommendationAlign },
                ]}
            >
                Recommended: {recommendedSize}, {recommendedDimensions}
            </Text>

            {/* Modal for full image view */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
                    <Image source={{ uri: imageUri! }} style={styles.modalImage} />
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 16,
        alignItems: "center",
    },
    label: {
        textAlign: "left",
        alignSelf: "flex-start",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#585858ff",
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
    },
    buttonText: {
        color: "rgba(115, 115, 115, 1)",
        fontWeight: "normal",
    },
    recommendation: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
        alignSelf: "flex-start",
        textAlign: "left",
        paddingLeft: 12,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalImage: {
        width: "90%",
        height: "70%",
        borderRadius: 12,
        resizeMode: "contain",
    },
});
