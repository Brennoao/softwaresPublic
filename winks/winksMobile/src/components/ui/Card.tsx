import { Image, type ImageStyle } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { type SFSymbol } from "expo-symbols";
import { Icon } from "@/components/ui/Icon";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { useBrand } from "@/context/gender-theme";
import { cn } from "@/lib/cn";

type CardProps = {
  colors?: readonly [string, string];

  shadow?: boolean;

  radius?: string;
  className?: string;

  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children?: ReactNode;
};

export function Card({
  colors,
  shadow = true,
  radius = "rounded-3xl",
  className,
  style,
  onPress,
  children,
}: CardProps) {
  const Brand = useBrand();
  const gradientColors = colors ?? [Brand.primary, Brand.secondary];

  return (
    <Pressable
      className={cn(radius, "border border-white/25 active:opacity-90", className)}
      style={[
        shadow
          ? {
              shadowColor: Brand.primary,
              shadowOpacity: 0.4,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
            }
          : undefined,
        style,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={radius}
      >
        {children}
      </LinearGradient>
    </Pressable>
  );
}

type CardMediaProps = {
  source?: string;

  className?: string;

  style?: StyleProp<ImageStyle & { boxShadow?: string }>;
};

export function CardMedia({ source, className, style }: CardMediaProps) {
  const [ratio, setRatio] = useState(3 / 4);

  if (className) {
    return (
      <Image
        source={source}
        contentFit="cover"
        contentPosition="top"
        className={cn("w-full rounded-3xl", className)}
        style={style}
      />
    );
  }

  return (
    <Image
      source={source}
      contentFit="cover"
      contentPosition="top"
      onLoad={(e) => setRatio(e.source.width / e.source.height)}
      className="w-full max-h-[380px] rounded-3xl"
      style={[{ aspectRatio: ratio }, style]}
    />
  );
}

type CardBadgeProps = {
  icon?: SFSymbol;
};

export function CardBadge({ icon = "sparkles" }: CardBadgeProps) {
  const Brand = useBrand();

  return (
    <View className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-black/25">
      <Icon name={icon} size={18} tintColor={Brand.accent} />
    </View>
  );
}

type CardContentProps = {
  className?: string;
  children?: ReactNode;
};

export function CardContent({ className, children }: CardContentProps) {
  return <View className={cn("p-4", className)}>{children}</View>;
}

type CardFooterProps = {
  overlay?: boolean;
  className?: string;
  children?: ReactNode;
};

export function CardFooter({ overlay = true, className, children }: CardFooterProps) {
  const row = (
    <View className={cn("flex-row items-end justify-between gap-3 p-4", className)}>
      {children}
    </View>
  );

  if (!overlay) return row;

  return (
    <LinearGradient
      colors={["transparent", "rgba(26,14,31,0.92)"]}
      pointerEvents="none"
      className="absolute inset-x-0 bottom-0 rounded-b-3xl pt-[72px]"
    >
      {row}
    </LinearGradient>
  );
}

type CardTitleProps = {
  className?: string;
  children?: ReactNode;
};

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <Text className={cn("text-3xl font-extrabold text-white", className)}>{children}</Text>
  );
}

type CardActionProps = {
  children: ReactNode;
};

export function CardAction({ children }: CardActionProps) {
  return (
    <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
      {children}
    </View>
  );
}
