import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "pt.yesola.appstore",
  appName: "YESOLA",
  webDir: "dist/public",
  server: {
    // Modo empacotado (App Store): a WebView corre os assets locais
    // (dist/public). Os /api relativos são prefixados para https://yesola.ao
    // pelo interceptor em src/lib/apiBase.ts. Sem url remota.
    // DEV (lane ios-dev): CAP_SERVER_URL=https://yesola.ao faz a app de
    // teste carregar o site ao vivo (estilo Expo Go p/ web: sem rebuild).
    ...(process.env.CAP_SERVER_URL
      ? { url: process.env.CAP_SERVER_URL }
      : {}),
    cleartext: false,
    androidScheme: "https",
    allowNavigation: ["yesola.ao", "www.yesola.ao"],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#2c3035",
      showSpinner: false,
    },
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#2c3035",
    scheme: "https",
  },
  android: {
    backgroundColor: "#2c3035",
  },
};

export default config;
