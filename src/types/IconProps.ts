import { FontAwesome } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type FontAwesomeName = ComponentProps<typeof FontAwesome>["name"];

export interface IconProps {
  name: FontAwesomeName; 
  position: "start" | "end";
  color?: string;
  size?: number;
}
