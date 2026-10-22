import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  show: boolean;
}

export function SplashScreen({ show }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background: "#ffffff",
            color: "#0b0b0c",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            pointerEvents: "auto",
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}
        >
          <img
            src="/logo-yesola.png"
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
    </AnimatePresence>
  );
}
