import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "pt.yesola.app",
  appName: "YESOLA",
  webDir: "dist/public",
  server: {
    androidScheme: "https",
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
