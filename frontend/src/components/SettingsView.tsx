import { motion } from "motion/react";
import { Settings, Globe, Moon, Sun, Monitor, Shield, Trash2, Zap, ShieldCheck } from "lucide-react";
import { Language, Theme } from "../types";
import { translations } from "../translations";

interface SettingsViewProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export default function SettingsView({ language, setLanguage, theme, setTheme }: SettingsViewProps) {
  const t = translations[language].settings;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 p-8 md:p-12 custom-scrollbar transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">{t.title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t.subtitle}</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-[32px] space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
          >
            <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Globe size={18} className="text-slim-blue" />
              {t.language}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLanguage('fr')}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  language === 'fr'
                    ? "bg-slim-blue/10 border-slim-blue text-slim-blue font-bold"
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slim-blue/30"
                }`}
              >
                <span>Français</span>
                {language === 'fr' && <div className="w-2 h-2 rounded-full bg-slim-blue" />}
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  language === 'en'
                    ? "bg-slim-blue/10 border-slim-blue text-slim-blue font-bold"
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slim-blue/30"
                }`}
              >
                <span>English</span>
                {language === 'en' && <div className="w-2 h-2 rounded-full bg-slim-blue" />}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-[32px] space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
          >
            <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Moon size={18} className="text-slim-pink" />
              {t.theme.title}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                  theme === 'light'
                    ? "bg-slim-pink/10 border-slim-pink text-slim-pink font-bold"
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slim-pink/30"
                }`}
              >
                <Sun size={20} />
                <span className="text-sm">{t.theme.light}</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                  theme === 'dark'
                    ? "bg-slim-pink/10 border-slim-pink text-slim-pink font-bold"
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slim-pink/30"
                }`}
              >
                <Moon size={20} />
                <span className="text-sm">{t.theme.dark}</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                  theme === 'system'
                    ? "bg-slim-pink/10 border-slim-pink text-slim-pink font-bold"
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slim-pink/30"
                }`}
              >
                <Monitor size={20} />
                <span className="text-sm">{t.theme.system}</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-8 rounded-[32px] space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
          >
            <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Zap size={18} className="text-slim-blue" />
              AI Preferences
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Model Selection</label>
                <select className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-slim-blue/20 text-slate-900 dark:text-white">
                  <option>Gemini 3 Flash (Fastest)</option>
                  <option>Gemini 3 Pro (Most Capable)</option>
                  <option>SlimAI Turbo (Experimental)</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-8 rounded-[32px] space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
          >
            <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Shield size={18} className="text-slim-green" />
              {t.gdprCompliance}
            </h4>
            <div className="p-4 rounded-2xl bg-slim-green/5 border border-slim-green/10 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-slim-green" size={16} />
                <span className="text-xs font-bold text-slim-green uppercase tracking-widest">Conformité RGPD</span>
              </div>
              {t.gdprText}
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Export Chat History</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Download all your conversations in JSON format.</p>
                </div>
                <Settings size={18} className="text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all group">
                <div className="text-left">
                  <p className="text-sm font-bold text-red-600 dark:text-red-500">Delete All Data</p>
                  <p className="text-xs text-red-400 dark:text-red-400/70">Permanently remove all your chats and account info.</p>
                </div>
                <Trash2 size={18} className="text-red-400 group-hover:text-red-600 transition-all" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
