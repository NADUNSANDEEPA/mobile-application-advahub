import React, { useState, useRef, JSX, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ToastAndroid,
    Dimensions,
} from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import InputField from "../../../components/Form/FormTextFeild";
import FileInput from "../../../components/Form/FileInput";
import SectionTitle from "../../../components/Form/FormTitle";
import FormButton from "../../../components/Form/FormButton";
import { pageCreate } from "../../../services/action/pageService";
import { IS_TESTING, USER_TOKEN_CACHINNG_KEY } from "../../../../config";
import { jwtDecode } from "jwt-decode";
import FormDropdown from "../../../components/Form/FormDropdown";
import { countries } from "../../../types/Countries";
import { activities } from "../../../types/Activities";
import { getItemAsyncStorage } from "../../../utils/AsyncStorageService";

export default function CreateBussinessPage({ backToPage }: { backToPage: () => void }): JSX.Element {
    const [businessName, setBusinessName] = useState(IS_TESTING ? "Namunukula Hiking Camp" : "");
    const [contactNumber, setContactNumber] = useState(IS_TESTING ? "+94772233445" : "");
    const [email, setEmail] = useState(IS_TESTING ? "info@namunukulahiking.lk" : "");
    const [registrationNumber, setRegistrationNumber] = useState(IS_TESTING ? "HIK123456" : "");
    const [category, setCategory] = useState(IS_TESTING ? "Hiking & Trekking" : "");
    const [address, setAddress] = useState(IS_TESTING ? "Namunukula Mountain Range, Badulla, Sri Lanka" : "");
    const [website, setWebsite] = useState(IS_TESTING ? "https://namunukulahiking.lk" : "");
    const [operatingHours, setOperatingHours] = useState(IS_TESTING ? "6 AM - 6 PM" : "");
    const [description, setDescription] = useState(IS_TESTING ? "Experience breathtaking views, guided treks, and overnight camping at the scenic Namunukula mountain range." : "");

    const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
    const [logo, setLogo] = useState<string | null>(null);
    const [decoded, setDecoded] = useState<any>(null);

    const [country, setCountry] = useState(IS_TESTING ? "Sri Lanka" : "");

    const screenWidth = Dimensions.get("window").width;

    // Error state
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await getItemAsyncStorage(USER_TOKEN_CACHINNG_KEY);
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setDecoded(decodedToken);
                    console.log("Decoded JWT:", decodedToken);
                }
            } catch (error) {
                console.log("Error decoding token:", error);
            }
        };
        loadToken();
    }, []);

    const richText = useRef<RichEditor>(null);

    const validateFields = () => {
        const newErrors: any = {};

        // Required field checks
        if (!businessName.trim()) newErrors.businessName = "Business Name is required";
        if (!contactNumber.trim()) newErrors.contactNumber = "Contact Number is required";
        if (!email.trim()) newErrors.email = "Email is required";
        if (!registrationNumber.trim()) newErrors.registrationNumber = "Registration Number is required";
        if (!category.trim()) newErrors.category = "Activity Category is required";
        if (!address.trim()) newErrors.address = "Address is required";
        if (!country.trim()) newErrors.country = "Country is Empty";
        if (!website.trim()) newErrors.website = "Website/Social Media is required";
        if (!operatingHours.trim()) newErrors.operatingHours = "Operating Hours are required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!coverPhoto) newErrors.coverPhoto = "Cover Photo is required";
        if (!logo) newErrors.logo = "Logo is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        const phoneRegex = /^\+?\d{7,15}$/; 
        if (contactNumber && !phoneRegex.test(contactNumber.trim())) {
            newErrors.contactNumber = "Enter a valid phone number (e.g., +94771234567)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleCreateBusiness = async () => {
        if (!validateFields()) {
            return;
        }

        if (decoded) {
            const pageData = {
                pageOwner: {
                    _id: decoded.user._id,
                    email: decoded.user.email
                },
                businessName,
                address,
                category,
                contactNumber,
                coverPhoto,
                description,
                email,
                logo,
                operatingHours,
                registrationNumber,
                website,
                country
            };

            console.log("Submitting Page Data:", pageData);
            const response = await pageCreate(pageData);

            if (!response.success) {
                ToastAndroid.show(`Page Registration Failed`, ToastAndroid.SHORT);
                return;
            }

            ToastAndroid.show("Business page created successfully!", ToastAndroid.LONG);
            console.log("Created Page:", response.data);
            backToPage();
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <SectionTitle
                title="Create Your Business Profile"
                subtitle="Fill out the details below to start showcasing your services."
            />

            <InputField
                label="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
                errorMessage={errors.businessName}
            />

            <InputField
                label="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
                errorMessage={errors.contactNumber}
            />

            <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                errorMessage={errors.email}
            />

            <InputField
                label="Registration Number"
                value={registrationNumber}
                onChangeText={setRegistrationNumber}
                errorMessage={errors.registrationNumber}
            />

            <FormDropdown
                label="Activity Category"
                selectedValue={category}
                style={{ width: "100%", marginBottom: 20 }}
                onValueChange={setCategory}
                items={activities}
                glass={false}
            />


            <InputField
                label="Address"
                value={address}
                onChangeText={setAddress}
                errorMessage={errors.address}
            />

            <FormDropdown
                label="Country"
                selectedValue={country}
                style={{ width: "100%", marginBottom: 20 }}
                onValueChange={setCountry}
                items={countries}
                glass={false}
            />

            <InputField
                label="Website / Social Media"
                value={website}
                onChangeText={setWebsite}
                errorMessage={errors.website}
            />

            <InputField
                label="Operating Hours"
                value={operatingHours}
                onChangeText={setOperatingHours}
                errorMessage={errors.operatingHours}
            />

            {/* Rich Text Editor for Description */}
            <View style={{ width: "100%", marginBottom: 16 }}>
                <Text style={styles.inputLabel}>Short Description / Tagline</Text>
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
                {errors.description && <Text style={styles.error}>{errors.description}</Text>}
            </View>

            <View style={{ marginBottom: 90 }}>
                <View style={{ marginTop: 86, marginBottom: 10 }}>
                    {decoded && (
                        <View style={styles.fieldContainer}>
                            <FileInput
                                label="Cover Photo"
                                imageUri={coverPhoto}
                                customerId={decoded.user._id}
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
                            {errors.coverPhoto && <Text style={styles.error}>{errors.coverPhoto}</Text>}
                        </View>
                    )}


                    {decoded && (
                        <View style={styles.fieldContainer}>
                            <FileInput
                                label="Logo"
                                imageUri={logo}
                                customerId={decoded.user._id}
                                type="page/logo"
                                onUploaded={setLogo}
                                recommendedSize="Max 1MB"
                                recommendedDimensions="300x300px"
                                buttonWidth={screenWidth - 70}
                                buttonHeight={49}
                                buttonBorderRadius={8}
                                buttonBorderWidth={1}
                                buttonBorderColor="rgba(169, 169, 169, 0.5)"
                                buttonBackgroundColor="#eaeaeaff"
                                recommendationAlign="center"
                            />
                            {errors.logo && <Text style={styles.error}>{errors.logo}</Text>}
                        </View>
                    )}
                </View>
                <View style={styles.buttonRow}>
                    <FormButton
                        title="Cancel"
                        onPress={backToPage}
                        gradientColors={["#888", "#888"]}
                        width={screenWidth / 2 - 40}
                        height={50}
                        borderRadius={4}
                        borderWidth={2}
                        borderColor="white"
                    />

                    <FormButton
                        title="Create Page"
                        onPress={handleCreateBusiness}
                        iconName="check"
                        width={screenWidth / 2 - 40}
                        height={50}
                        borderRadius={4}
                        borderWidth={2}
                        borderColor="white"
                    />
                </View>
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: "center",
        backgroundColor: "#fdfdfd",
        marginTop: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#585858ff",
    },
    error: {
        color: "#e53935",
        fontSize: 11,
        marginTop: 4,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 40,
    },
});
