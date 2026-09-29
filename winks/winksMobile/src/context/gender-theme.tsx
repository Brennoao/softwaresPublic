import { vars } from "nativewind";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { View } from "react-native";

import { BRAND_CSS_VARS, BRAND_PALETTES, type Gender } from "@/constants/theme";
import { getGenderTheme, setGenderTheme } from "@/lib/gender-theme-storage";

type GenderThemeContextValue = {
  gender: Gender;

  setGender: (gender: Gender) => void;
  colors: (typeof BRAND_PALETTES)[Gender];
};

const GenderThemeContext = createContext<GenderThemeContextValue | null>(null);

const CSS_VARS_BY_GENDER = {
  feminino: vars(BRAND_CSS_VARS.feminino),
  masculino: vars(BRAND_CSS_VARS.masculino),
} as const;

export function GenderThemeProvider({ children }: { children: ReactNode }) {
  const [gender, setGenderState] = useState<Gender>("feminino");

  useEffect(() => {
    getGenderTheme().then(setGenderState);
  }, []);

  const setGender = (next: Gender) => {
    setGenderState(next);
    setGenderTheme(next);
  };

  const value = useMemo<GenderThemeContextValue>(
    () => ({ gender, setGender, colors: BRAND_PALETTES[gender] }),
    [gender]
  );

  return (
    <GenderThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, CSS_VARS_BY_GENDER[gender]]}>{children}</View>
    </GenderThemeContext.Provider>
  );
}

export function useGenderTheme() {
  const ctx = useContext(GenderThemeContext);
  if (!ctx) throw new Error("useGenderTheme precisa estar dentro de um GenderThemeProvider");
  return ctx;
}

export function useBrand() {
  return useGenderTheme().colors;
}
