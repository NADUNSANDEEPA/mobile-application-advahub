import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlassView } from "expo-glass-effect";
import AppButton from "../components/Button/AppButton";
import AppInput from "../components/TextFeild/AppInput";
import AppDropdown from "../components/DropDown/AppDropdown";
import { register } from "../services/action/authService";
import CommonResponse from "../interface/CommonResponse";
import { IS_TESTING } from "../../config";


export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  // Step 2
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (IS_TESTING) {
    useEffect(() => {
      setName("John Doe");
      setPhone("+94771234567");
      setAddress("123 Main Street, Colombo, Sri Lanka");
      setBloodGroup("O+");

      setEmail("johndoe99@gmail.com");
      setPassword("SecurePassword123");
      setConfirmPassword("SecurePassword123");
    }, []);
  }


  const onNext = () => {
    setStep(2);
  };

  const onRegister = async () => {
    if (!email || !password || !confirmPassword) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }
    if (password !== confirmPassword) {
      ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
      return;
    }

    try {
      const response: CommonResponse = await register(name, phone, address, bloodGroup, email, password);

      if (response.success) {
        ToastAndroid.show(response.message || "Account created successfully!", ToastAndroid.SHORT);
        navigation.navigate("Login");
      } else {
        ToastAndroid.show(response.message || "Registration failed", ToastAndroid.SHORT);
      }
    } catch (err: any) {
      ToastAndroid.show(err.message || "Something went wrong", ToastAndroid.SHORT);
    }
  };


  const loginAction = () => {
    navigation.navigate("Login");
  }

  const backStep = () => {
    setStep(1);
  }

  return (
    <ImageBackground
      source={require("../../assets/bg-img.webp")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0.7)", "rgba(1, 42, 31, 1)"]}
        style={styles.overlay}
      >
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <GlassView style={styles.glassContainer}>
          <Text style={styles.title}>Register</Text>

          {step === 1 ? (
            <>
              <AppInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                glass
              />
              <AppInput
                placeholder="Telephone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                glass
              />
              <AppInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                glass
              />
              <AppDropdown
                label="false"
                selectedValue={bloodGroup}
                onValueChange={setBloodGroup}
                items={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                glass
              />


              <AppButton
                title="NEXT"
                onPress={onNext}
                icon={{ name: "long-arrow-right", position: "end", color: "#fff" }}
              />
            </>
          ) : (
            <>
              <AppInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                glass
              />
              <AppInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                glass
              />
              <AppInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                glass
              />

              <AppButton
                title="REGISTER"
                onPress={onRegister}
                icon={{ name: "check-circle", position: "end", color: "#fff" }}
              />


              <TouchableOpacity
                onPress={backStep}
                style={styles.linkContainer}
              >
                <Text style={styles.linkText}><Text style={{ color: "#e1e1e1ff", fontWeight: 'bold' }}>  Back</Text></Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={loginAction}
                style={styles.linkContainer}
              >
                <Text style={styles.linkText}>I have An Account. <Text style={{ color: "#e1e1e1ff", fontWeight: 'bold' }}>SignIn</Text></Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={loginAction}
                style={styles.linkContainer}
              >
              </TouchableOpacity>

              <View style={styles.progressWrapper}>
                <View
                  style={[
                    styles.progressBar
                  ]}
                />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("Terms")}
                style={styles.linkContainer}
              >
                <Text style={styles.linkText}>Terms and Conditions</Text>
              </TouchableOpacity>

            </>
          )}
        </GlassView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
  glassContainer: {
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  progressWrapper: {
    width: "100%",
    height: 1,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 20,
    marginTop: 30
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#414d4dff",
    borderRadius: 3,
  },
  linkContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#b9b9b9ff",
    fontSize: 14,
    textDecorationLine: "none",
  }
});
