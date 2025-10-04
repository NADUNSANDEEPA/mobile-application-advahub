import React, { useRef } from "react";
import { View, Dimensions, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import FormButton from "../../../../components/Form/FormButton";

export default function QRGenerator() {
    const screenWidth = Dimensions.get("window").width;
    const viewShotRef = useRef<ViewShot>(null);
    const data = "https://example.com?user=nadun";

    const saveQr = async () => {
        try {
            const uri = await captureRef(viewShotRef, {
                format: "png",
                quality: 1,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission required", "Please allow gallery access to save QR code.");
                    return;
                }

                await MediaLibrary.saveToLibraryAsync(uri);
                Alert.alert("Success", "QR code saved to your gallery 🎉");
            }
        } catch (e) {
            console.error("Error saving QR:", e);
            Alert.alert("Error", "Could not save QR code.");
        }
    };

    return (
        <View style={{ alignItems: "center", marginTop: 40 }}>
            <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
                <QRCode value={data} size={220} color="#000" backgroundColor="#fff" />
            </ViewShot>

            <View style={{ marginTop: "5%" }}>
                <FormButton
                    title="Save"
                    onPress={saveQr}
                    width={screenWidth / 2 - 40}
                    height={50}
                    borderRadius={4}
                    borderWidth={2}
                    borderColor="white"
                    gradientColors={["#888", "#888"]}
                />
            </View>
        </View>
    );
}
