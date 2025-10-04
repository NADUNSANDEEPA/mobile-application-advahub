import React, { JSX } from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import FormButton from "../../../components/Form/FormButton";
import SectionTitle from "../../../components/Form/FormTitle";

interface IntroBussinessPageProps {
    onGetStarted?: () => void;
}

export default function IntroBussinessPage({ onGetStarted }: IntroBussinessPageProps): JSX.Element {
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require("../../../../assets/business-intro.webp")}
                style={styles.image}
                resizeMode="contain"
            />
            <SectionTitle
                title="Welcome to AdvaHub Business"
                subtitle=" Start your adventure by creating your business profile. Showcase your offerings and connect with clients easily."
            />
            <FormButton 
            title="Get Started" 
            onPress={onGetStarted || (() => { })} 
            width={150}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
    },
    image: {
        width: 300,
        height: 200,
        marginBottom: 24,
    },
    button: {
        backgroundColor: "#1B9C85",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
