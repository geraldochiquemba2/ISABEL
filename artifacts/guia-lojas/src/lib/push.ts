import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { isNativeApp } from "@/lib/nativePhoto";

let started = false;

// Regista o iPhone para push (pede a permissão do sistema uma vez e envia
// o token ao servidor). Chamado no arranque da app instalada; na web não faz nada.
export async function initPush(): Promise<void> {
  if (started) return;
  started = true;
  try {
    if (!isNativeApp()) return;
    if (!Capacitor.isPluginAvailable("PushNotifications")) return;
    if (localStorage.getItem("yesola-push-registered") === "1") return;
    const perm = await PushNotifications.checkPermissions();
    const state =
      perm.receive === "granted"
        ? "granted"
        : (await PushNotifications.requestPermissions()).receive;
    if (state !== "granted") return;
    await PushNotifications.register();
    PushNotifications.addListener("registration", async (t) => {
      try {
        await fetch("/api/push/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: t.value, platform: Capacitor.getPlatform() }),
        });
        localStorage.setItem("yesola-push-registered", "1");
      } catch {
        /* tenta no próximo arranque */
      }
    });
    PushNotifications.addListener("registrationError", (e) => {
      console.warn("push registration:", e.error);
    });
  } catch {
    /* ambiente sem push */
  }
}
