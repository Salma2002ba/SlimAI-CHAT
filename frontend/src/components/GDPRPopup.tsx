import { motion } from "motion/react";
import { ShieldCheck, X } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";

interface GDPRPopupProps {
  onClose: () => void;
  language: Language;
}

export default function GDPRPopup({ onClose, language }: GDPRPopupProps) {
  const t = translations[language].gdpr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass max-w-lg w-full p-8 rounded-[40px] border-white/40 dark:border-slate-800 shadow-2xl relative bg-white dark:bg-slate-900 transition-colors duration-300"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-green-600 dark:text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">{t.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t.subtitle}</p>
        </div>

        <div className="space-y-4 mb-8">
          {[
            { title: t.transparency, text: t.transparencyText },
            { title: t.rightToForget, text: t.rightToForgetText },
            { title: t.security, text: t.securityText }
          ].map((point, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{point.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{point.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
        >
          {t.understand}
        </button>
      </motion.div>
    </div>
  );
}
