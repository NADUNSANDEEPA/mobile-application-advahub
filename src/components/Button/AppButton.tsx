import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import type { IconProps } from "../../types/IconProps";

type ButtonSize = "small" | "normal" | "large" | "xl" | "xxl";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  isFill?: boolean;
  size?: ButtonSize;
  textColor?: string;
  fontSize?: number;
  style?: ViewStyle | ViewStyle[];
  backgroundColor?: string[]; 
  icon?: IconProps;
  rounded?: boolean;
}

export default function AppButton({
  title,
  onPress,
  isFill = true,
  size = "normal",
  textColor = "#fff",
  fontSize,
  style,
  backgroundColor = ["#6f5c4b", "#736250"],
  icon,
  rounded = false,
}: AppButtonProps) {
  const sizes: Record<
    ButtonSize,
    { paddingVertical: number; paddingHorizontal: number; font: number }
  > = {
    small: { paddingVertical: 6, paddingHorizontal: 12, font: 14 },
    normal: { paddingVertical: 10, paddingHorizontal: 16, font: 16 },
    large: { paddingVertical: 12, paddingHorizontal: 20, font: 18 },
    xl: { paddingVertical: 14, paddingHorizontal: 24, font: 20 },
    xxl: { paddingVertical: 18, paddingHorizontal: 28, font: 22 },
  };

  const selectedSize = sizes[size] || sizes.normal;
  const appliedFontSize = fontSize || selectedSize.font;

  const Container: React.ElementType = isFill ? LinearGradient : View;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
      <Container
        {...(isFill
          ? { colors: backgroundColor }
          : { style: { backgroundColor: "transparent" } })}
        style={[
          styles.button,
          {
            paddingVertical: selectedSize.paddingVertical,
            paddingHorizontal: selectedSize.paddingHorizontal,
            borderRadius: rounded ? 50 : 8,
            borderWidth: isFill ? 0 : 2,
            borderColor: isFill ? "transparent" : backgroundColor[0],
          },
        ]}
      >
        {icon?.position === "start" && (
          <FontAwesome
            name={icon.name}
            size={icon.size || 18}
            color={icon.color || textColor}
            style={{ marginRight: 8 }}
          />
        )}

        <Text
          style={[
            {
              color: textColor,
              fontSize: appliedFontSize,
              fontWeight: "600",
            } as TextStyle,
          ]}
        >
          {title}
        </Text>

        {icon?.position === "end" && (
          <FontAwesome
            name={icon.name}
            size={icon.size || 18}
            color={icon.color || textColor}
            style={{ marginLeft: 8 }}
          />
        )}
      </Container>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
