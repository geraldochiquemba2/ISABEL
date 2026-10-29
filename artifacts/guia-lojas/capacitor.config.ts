import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "pt.yesola.appstore",
  appName: "YESOLA",
  webDir: "dist/public",
  server: {
    // Modo remoto (App Store/Play Store): a WebView carrega o site de
    // produção, por isso a app acompanha sempre o que está publicado em
    // yesola.ao sem precisar de novo build. Os assets de dist/public ficam
    // só para o cap sync. CAP_SERVER_URL permite apontar para outro
    // ambiente (ex.: preview/staging).
    url: process.env.CAP_SERVER_URL ?? "https://yesola.ao",
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
      overlaysWebView: false,
      style: "LIGHT",
      backgroundColor: "#FFFFFF",
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
