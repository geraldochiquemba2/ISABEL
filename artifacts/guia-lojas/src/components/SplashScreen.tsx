import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface SplashScreenProps {
  show: boolean;
}

export function SplashScreen({ show }: SplashScreenProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100dvh",
            zIndex: 2147483647,
            background: "#ffffff",
            color: "#0b0b0c",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            pointerEvents: "all",
            touchAction: "none",
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}
        >
          <img
            src="/logo-yesola-star-gold.png"
            alt="YESOLA"
            style={{
              width: 150,
              height: "auto",
              display: "block",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
            }}
          />
          <span
            style={{
              fontSize: 13,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#b8860b",
            }}
          >
            YESOLA Collection
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
