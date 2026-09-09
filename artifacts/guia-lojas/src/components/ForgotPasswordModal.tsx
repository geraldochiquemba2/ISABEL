import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Check } from "lucide-react";
import { requestPasswordReset } from "@/lib/api";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  storeType: string;
  accentColor?: string;
}

export default function ForgotPasswordModal({ open, onClose, storeType, accentColor = "#D4A843" }: ForgotPasswordModalProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!phone || phone.length < 9) {
      setError("Insira um número de telefone válido.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await requestPasswordReset(phone, storeType);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Erro ao enviar pedido.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhone("");
    setSuccess(false);
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4" onClick={handleClose}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RotateCcw size={18} style={{ color: accentColor }} />
              <h3 className="text-sm font-semibold">Redefinir Senha</h3>
            </div>
            <button onClick={handleClose} className="text-[#87909a] hover:text-[#30343a]"><X size={18} /></button>
          </div>

          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Check size={24} className="text-emerald-600" />
              </div>
              <p className="text-sm text-[#30343a] font-medium">Pedido enviado!</p>
              <p className="text-xs text-[#87909a] mt-1">Aguarde a aprovação do administrador.</p>
              <button onClick={handleClose} className="mt-4 px-6 py-2 rounded-full text-white text-sm font-medium transition-colors" style={{ backgroundColor: accentColor }}>Fechar</button>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#87909a] mb-4">Insira o seu número de telefone. O administrador irá aprovar o pedido de redefinição de senha.</p>
              <div className="mb-3">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#87909a] mb-1.5">Telefone</label>
                <input value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} placeholder="Ex: 912345678" className="w-full border border-[#d1d4d8] bg-white py-2.5 px-4 text-sm text-[#30343a] placeholder:text-[#87909a] outline-none focus:border-[#d96f5c] focus:ring-2 focus:ring-[#d96f5c]/10 transition-all rounded-xl" />
              </div>
              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
              <div className="flex gap-2">
                <button onClick={handleClose} className="flex-1 px-4 py-2.5 border border-[#d1d4d8] rounded-full text-xs text-[#87909a] hover:bg-gray-50 transition-colors">Cancelar</button>
                <button onClick={handleSubmit} disabled={loading || !phone} className="flex-1 px-4 py-2.5 text-white rounded-full text-xs font-medium transition-colors disabled:opacity-50" style={{ backgroundColor: accentColor }}>
                  {loading ? "A enviar..." : "Enviar Pedido"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
