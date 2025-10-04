import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoadingPage from "../screens/LoadingPage";
import HomeScreen from "../screens/HomeScreen";
import CampDetailsScreen from "../screens/CampDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Loading" component={LoadingPage} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CampDetails" component={CampDetailsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
    </Stack.Navigator>

  );
}
