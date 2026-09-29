import { type SFSymbol } from "expo-symbols";
import { Icon } from "@/components/ui/Icon";
import { Text, View } from "react-native";

import { Card, CardContent } from "../ui/Card";

type StatCardProps = {
  icon: SFSymbol;
  value: number;
  label: string;
  color: string;
};

export function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <Card
      colors={[`${color}29`, `${color}12`]}
      shadow={false}
      radius="rounded-2xl"
      className="flex-1 self-start"
      style={{ borderColor: `${color}4D` }}
    >
      <CardContent className="gap-2 flex-row">
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}26` }}
        >
          <Icon name={icon} size={17} tintColor={color} />
        </View>

        <View>
          <Text className="text-2xl font-extrabold" style={{ color }}>
            {value}
          </Text>
          <Text className="text-[#8A5A78]">{label}</Text>
        </View>
      </CardContent>
    </Card>
  );
}
