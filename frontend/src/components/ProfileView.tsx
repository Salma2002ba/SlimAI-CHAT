import { motion } from "motion/react";
import { User, Shield, Camera } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";

interface ProfileViewProps {
  language: Language;
}

export default function ProfileView({ language }: ProfileViewProps) {
  const t = translations[language].profile;

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

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-[32px] flex flex-col md:flex-row items-center gap-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
          >
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-slim-blue via-slim-pink to-slim-green p-1">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://picsum.photos/seed/user/200"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:scale-110 transition-all">
                <Camera size={18} />
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-1">Salma BABA</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Ingénieure Cloud & DevOps</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-pastel-blue dark:bg-slim-blue/20 text-slim-blue text-xs font-bold rounded-full uppercase tracking-wider">
                  Premium
                </span>
                <span className="px-3 py-1 bg-pastel-pink dark:bg-slim-pink/20 text-slim-pink text-xs font-bold rounded-full uppercase tracking-wider">
                  Early Adopter
                </span>
              </div>
            </div>

            <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-200 dark:shadow-none">
              {language === 'fr' ? 'Modifier le Profil' : 'Edit Profile'}
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-3xl space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
            >
              <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <User size={18} className="text-slim-blue" />
                {t.personalInfo}
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                    {language === 'fr' ? 'Nom Complet' : 'Full Name'}
                  </label>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Salma BABA</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                    Email
                  </label>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">salma2002ba@gmail.com</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                    {language === 'fr' ? 'Localisation' : 'Location'}
                  </label>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Marseille, France</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-3xl space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
            >
              <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-slim-pink" />
                {t.security}
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                    {language === 'fr' ? 'Mot de passe' : 'Password'}
                  </label>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">••••••••••••</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                    {language === 'fr' ? 'Double Authentification' : 'Two-Factor Auth'}
                  </label>
                  <p className="text-sm font-medium text-green-500">{language === 'fr' ? 'Activé' : 'Enabled'}</p>
                </div>
                <button className="text-xs font-bold text-slim-blue hover:underline uppercase tracking-wider">
                  {t.changePassword}
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-8 rounded-[32px] space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
          >
            <h4 className="font-display font-bold text-slate-800 dark:text-white">{t.connectedAccounts}</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Google</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Connected as salma2002ba@gmail.com</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-red-500 hover:underline uppercase tracking-wider">{t.disconnect}</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">GitHub</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'fr' ? 'Non connecté' : 'Not connected'}</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-slim-blue hover:underline uppercase tracking-wider">
                  {language === 'fr' ? 'Connecter' : 'Connect'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
