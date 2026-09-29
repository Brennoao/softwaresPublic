import { Ionicons } from "@expo/vector-icons";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { Platform, type ColorValue } from "react-native";

const ICON_MAP: Partial<Record<SFSymbol, keyof typeof Ionicons.glyphMap>> = {
  sparkles: "sparkles",
  heart: "heart-outline",
  "heart.fill": "heart",
  "flame.fill": "flame",
  "person.2.fill": "people",
  "wand.and.stars": "color-wand",
  tv: "tv-outline",
  "play.circle.fill": "play-circle",
  "chevron.right": "chevron-forward",
  "chevron.left": "chevron-back",
  "arrow.right": "arrow-forward",
  "arrow.clockwise": "refresh",
  trash: "trash-outline",
  magnifyingglass: "search",
  "arrow.up": "arrow-up",
  "arrow.down": "arrow-down",
  "house.fill": "home",
  "gearshape.fill": "settings-outline",
  "person.crop.circle": "person-circle-outline",
  "lock.shield.fill": "shield-checkmark-outline",
};

type IconProps = {
  name: SFSymbol;
  size?: number;
  tintColor?: ColorValue;
  className?: string;
};

export function Icon({ name, size = 24, tintColor = "#000000", className }: IconProps) {
  if (Platform.OS === "ios") {
    return <SymbolView name={name} size={size} tintColor={tintColor} className={className} />;
  }

  return (
    <Ionicons
      name={ICON_MAP[name] ?? "help-circle-outline"}
      size={size}
      color={tintColor}
      className={className}
    />
  );
}
