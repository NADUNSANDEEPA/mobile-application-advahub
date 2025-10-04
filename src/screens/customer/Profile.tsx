import React, { JSX } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Profile(): JSX.Element {
  return (
    <View style={styles.content}>
      <Text style={styles.tabText}>Profile Content</Text>
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
  },
});
