import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { clearStorageAsyncStorage } from "../../utils/AsyncStorageService";

export default function NotificationScreen({ navigation }: { navigation?: any }) {
  
  const handleClearToken = async () => {
    try {
      await clearStorageAsyncStorage();
      console.log("User token cleared!");
      navigation.reset({
        index: 0,
        routes: [{ name: "Loading" }],
      });
    } catch (error) {
      console.log("Error clearing user token:", error);
    }
  };

  return (
    <View style={styles.content}>
      <Text style={styles.tabText}>Notification Screen Content</Text>
      <TouchableOpacity style={styles.button} onPress={handleClearToken}>
        <Text style={styles.buttonText}>Clear Token</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
