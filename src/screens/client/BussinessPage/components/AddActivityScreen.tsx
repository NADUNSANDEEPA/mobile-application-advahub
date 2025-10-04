import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import SectionTitle from "../../../../components/Form/FormTitle";
import FormDropdown from "../../../../components/Form/FormDropdown";
import FormButton from "../../../../components/Form/FormButton";
import FileInput from "../../../../components/Form/FileInput";
import { postActivity } from "../../../../services/action/pageService";
import InputField from "../../../../components/Form/FormTextFeild";

interface AddActivityScreenProps {
    onSave: (activity: any) => void;
    onClose: () => void;
    pageData: any;
}

export default function AddActivityScreen({ onSave, onClose, pageData }: AddActivityScreenProps) {
    const [title, setTitle] = useState("Medicinal Plant Workshop With Camping");
    const [description, setDescription] = useState("Learn to identify and use local medicinal plants during a 2KM educational hike.");
    const [specialInstruction, setSpecialInstruction] = useState("Wear comfortable shoes, carry water, and bring a notebook for notes and sketches.");

    const [ageGroup, setAgeGroup] = useState("All");
    const [coverPhoto, setCoverPhoto] = useState<string | null>(null);

    const screenWidth = Dimensions.get("window").width;
    const richText = useRef<RichEditor>(null);

    const [decodedUserToekn, setDecodedUserToekn] = useState<any>(null);
    const [decodedPageToken, setDecodedPageToken] = useState<any>(pageData);

    useEffect(() => {
        const loadUserToken = async () => {
            try {
                const userToken = await AsyncStorage.getItem("userToken");
                if (userToken) {
                    const decodedUserToken = jwtDecode(userToken);
                    setDecodedUserToekn(decodedUserToken);
                    console.log("Decoded User JWT:", decodedUserToken);
                }
            } catch (error) {
                console.log("Error decoding token:", error);
            }
        };

        loadUserToken();
    }, []);

    const handleSave = async () => {
        const newActivity = {
            id: Date.now().toString(),
            title,
            description,
            specialInstruction,
            ageGroup,
            coverPhoto,
            date: new Date().toLocaleDateString(),
            pageId: decodedPageToken._id,
        };

        console.log("Posting Activity:", newActivity);


        const response = await postActivity(newActivity);
        if (response.success) {
            ToastAndroid.show("Activity posted successfully!", ToastAndroid.SHORT);
            setTimeout(() => {
                onSave(newActivity);
            }, 3000);
        } else {
            ToastAndroid.show(`Failed to post activity: ${response.message}`, ToastAndroid.SHORT);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <SectionTitle
                    title="Add New Activity"
                    subtitle="Fill in the details below to add a new activity."
                />

                {/* Title */}
                <View style={styles.fieldContainer}>
                    <InputField
                        label="Activity Title"
                        placeholder=""
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Special Instruction */}
                <View style={styles.fieldContainer}>
                    <InputField
                        label="Special Instructions"
                        placeholder=""
                        value={specialInstruction}
                        onChangeText={setSpecialInstruction}
                        multiline
                    />
                </View>

                {/* Age Group */}
                <View style={styles.fieldContainer}>
                    <FormDropdown
                        label="Age Group"
                        selectedValue={ageGroup}
                        onValueChange={setAgeGroup}
                        items={[
                            "All Ages",
                            "Kids (5-12)",
                            "Teens (13-19)",
                            "Adults (20-50)",
                            "Seniors (50+)",
                        ]}
                        glass={false}
                    />
                </View>

                {/* Cover Photo Upload */}
                {decodedUserToekn && (
                    <View style={styles.fieldContainer}>
                        <FileInput
                            label="Cover Photo"
                            imageUri={coverPhoto}
                            customerId={decodedUserToekn.user._id}
                            type="page/activity"
                            onUploaded={setCoverPhoto}
                            recommendedSize="Max 2MB"
                            recommendedDimensions="1200x600px"
                            buttonWidth={screenWidth - 70}
                            buttonHeight={49}
                            buttonBorderRadius={8}
                            buttonBorderWidth={1}
                            buttonBorderColor="rgba(169, 169, 169, 0.5)"
                            buttonBackgroundColor="#eaeaeaff"
                            recommendationAlign="center"
                        />
                    </View>
                )}

                {/* Description */}
                <View style={styles.fieldContainer}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "600",
                        marginBottom: 6,
                        color: "#585858ff",
                    }}>
                        Description
                    </Text>
                    <RichEditor
                        ref={richText}
                        initialContentHTML={description}
                        onChange={setDescription}
                        placeholder="Describe your business in 1–2 lines"
                        style={{
                            backgroundColor: "#f2f2f2",
                            padding: 10,
                            minHeight: 120,
                            maxHeight: 200,
                            width: "100%",
                        }}
                    />
                    <RichToolbar editor={richText} />
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    <FormButton
                        title="Cancel"
                        onPress={onClose}
                        gradientColors={["#888", "#888"]}
                        width={screenWidth / 2 - 40}
                        height={50}
                        borderRadius={4}
                        borderWidth={2}
                        borderColor="white"
                    />

                    <FormButton
                        title="Save"
                        onPress={handleSave}
                        iconName="check"
                        width={screenWidth / 2 - 40}
                        height={50}
                        borderRadius={4}
                        borderWidth={2}
                        borderColor="white"
                    />
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    buttonRow: {
        marginTop: 100,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 40,
    },
});
