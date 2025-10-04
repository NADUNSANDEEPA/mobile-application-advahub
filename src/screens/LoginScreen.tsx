import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlassView } from "expo-glass-effect";
import AppButton from "../components/Button/AppButton";
import AppInput from "../components/TextFeild/AppInput";
import CommonResponse from '../interface/CommonResponse';
import { login } from "../services/action/authService";
import { IS_TESTING, USER_LOCATION_CACHINNG_KEY, USER_TOKEN_CACHINNG_KEY } from "../../config";
import useCurrentCountry from "../utils/CurrentCountry";
import { saveItemAsyncStorage } from "../utils/AsyncStorageService";


export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState(IS_TESTING ? "naduns@example.com" : "");
  const [password, setPassword] = useState(IS_TESTING ? "Password123" : "");

  const onLogin = async () => {
    console.log("Login pressed with:", { email, password });

    if (!email || !password) {
      ToastAndroid.show("Please enter both email and password.", ToastAndroid.SHORT);
      return;
    }

    const response: CommonResponse = await login(email, password);

    if (!response.success) {
      ToastAndroid.show(`Login failed: ${response.message || response.error}`, ToastAndroid.SHORT);
      return;
    }

    await saveItemAsyncStorage(USER_TOKEN_CACHINNG_KEY, response.data.token);
    ToastAndroid.show("Login Success.", ToastAndroid.LONG);

    try {
      const { country, location } = useCurrentCountry();
      if (location && country) {
        await saveItemAsyncStorage( USER_LOCATION_CACHINNG_KEY, { location, country });
        console.log("💾 Location cached at login:", country);
      }
    } catch (err) {
      console.log("Error fetching location at login:", err);
    }

    navigation.replace("Home");
  };

  const onForgotPassword = () => {
    Alert.alert("Forgot Password", "Redirecting to password recovery...");
  };

  const onClickRegister = () => {
    navigation.navigate("Registration");
  };

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
          <Text style={styles.title}>Login</Text>

          <AppInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
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

          <AppButton
            title="LOGIN"
            onPress={onLogin}
            icon={{ name: "long-arrow-right", position: "end", color: "#fff" }}
          />

          <TouchableOpacity
            onPress={onForgotPassword}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.progressWrapper}>
            <View style={styles.progressBar} />
          </View>

          <TouchableOpacity
            onPress={onClickRegister}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>
              Do not have An Account. <Text style={{ color: "#e1e1e1ff", fontWeight: 'bold' }}>SignUp</Text>
            </Text>
          </TouchableOpacity>
        </GlassView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  logo: { width: 120, height: 120, alignSelf: "center", marginBottom: 20 },
  glassContainer: {
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  forgotPasswordContainer: { marginTop: 10, alignItems: "center" },
  forgotPasswordText: { color: "#b9b9b9ff", fontSize: 14, textDecorationLine: "none" },
  progressWrapper: { width: "100%", height: 1, borderRadius: 3, overflow: "hidden", marginBottom: 20, marginTop: 30 },
  progressBar: { height: "100%", backgroundColor: "#414d4dff", borderRadius: 3 },
});
