import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, ArrowRight, Github, Mail, Lock, User, Sparkles } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";

interface LandingPageProps {
  onEnterChat: (isGuest: boolean) => void;
  language: Language;
}

export default function LandingPage({ onEnterChat, language }: LandingPageProps) {
  const [view, setView] = useState<"hero" | "login" | "signup">("hero");
  const [acceptedCGU, setAcceptedCGU] = useState(false);

  const t = translations[language].landing;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "signup" && !acceptedCGU) {
      alert(language === 'fr' ? "Veuillez accepter les CGU pour continuer." : "Please accept the Terms of Use to continue.");
      return;
    }
    onEnterChat(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden flex flex-col items-center justify-center p-6">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pastel-blue rounded-full blur-[150px] opacity-40 pointer-events-none dark:opacity-20"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pastel-pink rounded-full blur-[150px] opacity-40 pointer-events-none dark:opacity-20"
      />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pastel-green rounded-full blur-[120px] opacity-30 pointer-events-none dark:opacity-10" />

      <AnimatePresence mode="wait">
        {view === "hero" ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl w-full text-center z-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 rounded-3xl bg-linear-to-br from-slim-blue via-slim-pink to-slim-green p-0.5 mx-auto mb-10 animate-float shadow-2xl shadow-slim-blue/20"
            >
              <div className="w-full h-full rounded-[22px] bg-white dark:bg-slate-900 flex items-center justify-center">
                <Bot className="text-slim-blue" size={48} />
              </div>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {language === 'fr' ? 'Découvrez' : 'Meet'} <span className="gradient-text">SlimAI</span>
            </motion.h1>

            <motion.p
              className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t.heroSubtitle}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => setView("login")}
                className="px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-200 dark:shadow-none flex items-center gap-2 group"
              >
                {t.login}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button
                onClick={() => setView("signup")}
                className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-lg hover:border-slim-blue hover:text-slim-blue transition-all flex items-center gap-2"
              >
                {t.signup}
              </button>
              <button
                onClick={() => onEnterChat(true)}
                className="px-8 py-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-800 dark:hover:text-white transition-all flex items-center gap-2"
              >
                {t.tryGuest}
                <Sparkles size={16} />
              </button>
            </motion.div>

            <motion.div
              className="mt-20 flex items-center justify-center gap-8 text-slate-400 dark:text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">99%</span>
                <span className="text-xs uppercase tracking-widest font-bold">{language === 'fr' ? 'Précision' : 'Accuracy'}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">24/7</span>
                <span className="text-xs uppercase tracking-widest font-bold">{language === 'fr' ? 'Disponible' : 'Available'}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">Gratuit</span>
                <span className="text-xs uppercase tracking-widest font-bold">{language === 'fr' ? 'Accès Libre' : 'Open Access'}</span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md z-10 relative"
          >
            <button
              onClick={() => setView("hero")}
              className="absolute -left-12 top-10 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all"
            >
              <ArrowRight className="rotate-180" size={24} />
            </button>

            <div className="glass p-10 rounded-[40px] border-white/40 dark:border-white/10 shadow-2xl">
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slim-blue to-slim-pink p-0.5 mx-auto mb-6">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center">
                    <Bot className="text-slim-blue" size={32} />
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
                  {view === "login" ? t.login : t.signup}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {view === "login"
                    ? language === 'fr'
                      ? "Entrez vos identifiants pour continuer"
                      : "Enter your details to continue"
                    : language === 'fr'
                      ? "Rejoignez la communauté SlimAI dès aujourd'hui"
                      : "Join the SlimAI community today"}
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleAuthSubmit}>
                {view === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        placeholder={t.firstName}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-4 focus:ring-slim-blue/10 focus:border-slim-blue/30 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        placeholder={t.lastName}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-4 focus:ring-slim-blue/10 focus:border-slim-blue/30 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder={t.email}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-4 focus:ring-slim-blue/10 focus:border-slim-blue/30 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    placeholder={t.password}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-4 focus:ring-slim-blue/10 focus:border-slim-blue/30 transition-all placeholder:text-slate-400"
                  />
                </div>
                {view === "signup" && (
                  <>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        placeholder={t.confirmPassword}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-4 focus:ring-slim-blue/10 focus:border-slim-blue/30 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-start gap-3 px-2 py-2">
                      <input
                        type="checkbox"
                        id="cgu"
                        checked={acceptedCGU}
                        onChange={(e) => setAcceptedCGU(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-slim-blue focus:ring-slim-blue"
                      />
                      <label htmlFor="cgu" className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.acceptCGU}
                      </label>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-200 dark:shadow-none mt-4"
                >
                  {view === "login" ? t.login : t.signup}
                </button>
              </form>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {language === 'fr' ? 'Ou continuer avec' : 'Or continue with'}
                </span>
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-medium text-slate-600 dark:text-slate-400 text-sm">
                  <Github size={18} />
                  GitHub
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-medium text-slate-600 dark:text-slate-400 text-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={() => setView(view === "login" ? "signup" : "login")}
                  className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slim-blue transition-all"
                >
                  {view === "login" ? t.noAccount : t.alreadyAccount}
                </button>
                <div className="mt-4">
                  <button
                    onClick={() => onEnterChat(true)}
                    className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                  >
                    {t.tryGuest}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
