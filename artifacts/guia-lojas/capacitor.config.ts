import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "pt.yesola.app",
  appName: "YESOLA",
  webDir: "dist/public",
  server: {
    // Modo wrapper v1: a WebView carrega o site publicado (mesma origem →
    // /api e imagens funcionam sem mudar código). Requer internet.
    url: "https://yesola.ao",
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
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#2c3035",
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
