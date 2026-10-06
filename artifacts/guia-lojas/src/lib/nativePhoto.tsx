import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Share } from "@capacitor/share";
import { Camera as CameraIcon } from "lucide-react";
import { uploadImage, fetchStoreById, updateStore } from "@/lib/api";

// Só existe dentro da app instalada (iPhone/Android). No browser devolve false.
export function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

// Foto via câmara/galeria NATIVA (iPhone). Devolve dataUrl ou null
// (null = não é app nativa, plugin em falta ou utilizador cancelou).
export async function takeNativePhoto(): Promise<string | null> {
  try {
    if (!Capacitor.isNativePlatform()) return null;
    if (!Capacitor.isPluginAvailable("Camera")) return null;
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    return photo.dataUrl || null;
  } catch {
    return null;
  }
}

// Toque háptico subtil (só faz algo no dispositivo).
export function nativeTap(): void {
  try {
    Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* sem hápticos neste ambiente */
  }
}

// Partilha pela folha nativa (iOS) quando disponível; senão Web Share; senão clipboard.
export async function nativeShare(title: string, text: string, url: string): Promise<"shared" | "copied" | "dismissed"> {
  if (isNativeApp()) {
    try {
      if (Capacitor.isPluginAvailable("Share")) {
        await Share.share({ title, text, url, dialogTitle: title });
        return "shared";
      }
    } catch {
      return "dismissed";
    }
  }
  if (typeof navigator !== "undefined" && (navigator as any).share) {
    try {
      await (navigator as any).share({ title, text, url });
      return "shared";
    } catch {
      return "dismissed";
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "dismissed";
  }
}

// Botão "Câmara" auto-suficiente para as galerias das lojas: tira a foto com a
// câmara nativa, sobe pelo mesmo pipeline e anexa à galeria. Só aparece na app
// instalada — na web não renderiza nada (o input de ficheiro continua).
export function NativeCameraButton({ storeId }: { storeId: string }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  if (!isNativeApp()) return null;
  const snap = async () => {
    if (busy || !storeId) return;
    const dataUrl = await takeNativePhoto();
    if (!dataUrl) return;
    setBusy(true);
    try {
      const up = await uploadImage(dataUrl, `${storeId}-coverImages-${Date.now()}`);
      const s: any = await fetchStoreById(storeId);
      const current: string[] = Array.isArray(s?.coverImages) ? s.coverImages : [];
      await updateStore(storeId, { coverImages: [...current, up.imageUrl] } as any);
      qc.invalidateQueries({ queryKey: ["myStore"] });
      nativeTap();
    } catch (e) {
      console.error("upload câmara nativa:", e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <button
      type="button"
      onClick={snap}
      disabled={busy}
      title="Tirar fotografia"
      className="w-24 h-24 border border-dashed border-[#EDE8DE] rounded-xl flex flex-col items-center justify-center text-[10px] text-[#697482] hover:border-[#7A4549] hover:text-[#292727] cursor-pointer transition-colors disabled:opacity-50"
    >
      <CameraIcon size={16} className="mb-1" />
      {busy ? "A enviar..." : "Câmara"}
    </button>
  );
}
