/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  // "class": permite forçar o tema claro manualmente (`colorScheme.set("light")`,
  // em app/_layout.tsx) — o padrão "media" não deixa, só segue o SO/navegador.
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // RGB (não hex): permite o app trocar a cor em tempo real (tema
        // feminino/masculino) via variável CSS, mantendo os modificadores de
        // opacidade (`bg-primary/40`) funcionando normalmente.
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}