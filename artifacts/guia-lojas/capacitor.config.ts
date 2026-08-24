import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "pt.eliora.app",
  appName: "Eliora",
  webDir: "dist/public",
  server: {
    androidScheme: "https",
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#fffcf9",
    scheme: "https",
  },
  android: {
    backgroundColor: "#fffcf9",
  },
};

export default config;
