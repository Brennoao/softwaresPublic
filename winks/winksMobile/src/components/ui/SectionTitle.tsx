import { type SFSymbol } from "expo-symbols";
import { Icon } from "@/components/ui/Icon";
import { Text, View } from "react-native";

import { useBrand } from "@/context/gender-theme";

type SectionTitleProps = {
  icon?: SFSymbol;
  title: string;
};

export function SectionTitle({ icon = "sparkles", title }: SectionTitleProps) {
  const Brand = useBrand();

  return (
    <View className="flex-row items-center gap-2">
      <View
        className="h-7 w-7 items-center justify-center rounded-full"
        style={{ backgroundColor: `${Brand.accent}33` }}
      >
        <Icon name={icon} size={14} tintColor={Brand.accent} />
      </View>
      <Text className="text-primary font-extrabold text-lg tracking-wide">{title}</Text>
    </View>
  );
}
