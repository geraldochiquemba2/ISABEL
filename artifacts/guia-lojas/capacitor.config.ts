import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "pt.eliora.app",
  appName: "Eliora",
  webDir: "dist/public",
  server: {
    androidScheme: "https",
    url: "http://192.168.0.57:3000",
    cleartext: true,
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#fffcf9",
  },
  android: {
    backgroundColor: "#fffcf9",
  },
};

export default config;
