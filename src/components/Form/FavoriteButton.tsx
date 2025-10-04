import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

interface FavoriteButtonProps {
  isFavorite?: boolean;
  onToggle?: (newState: boolean) => void;
  showLabel?: boolean; 
}

export default function FavoriteButton({
  isFavorite = false,
  onToggle,
  showLabel = true,
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handlePress = () => {
    const newState = !favorite;
    setFavorite(newState);
    onToggle?.(newState);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.7}>
      <Ionicons
        name={favorite ? "heart" : "heart-outline"}
        size={28}
        color={favorite ? "red" : "gray"}
      />
      {showLabel && <Text style={styles.label}>{favorite ? "Favorited" : "Favorite"}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
  },
  label: {
    marginLeft: 6,
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
});
