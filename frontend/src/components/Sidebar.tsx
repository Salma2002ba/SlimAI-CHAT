import { motion } from "motion/react";
import { Plus, MessageSquare, Settings, User, LogOut, Search, Bot } from "lucide-react";
import { cn } from "../lib/utils";
import { ChatSession, AppView, Language } from "../types";
import { translations } from "../translations";

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentView: AppView;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
  language: Language;
}

export default function Sidebar({
  sessions,
  currentSessionId,
  currentView,
  onSelectSession,
  onNewChat,
  onViewChange,
  onLogout,
  language
}: SidebarProps) {
  const t = translations[language].sidebar;

  return (
    <aside className="w-72 h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => onViewChange('chat')}>
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slim-blue to-slim-pink flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-display font-bold gradient-text">SlimAI</h1>
        </div>

        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-200 dark:shadow-none mb-6"
        >
          <Plus size={18} />
          <span className="font-medium">{t.newChat}</span>
        </button>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder={language === 'fr' ? "Rechercher..." : "Search chats..."}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-slim-blue/20 transition-all text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-350px)] pr-2 custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">
            {language === 'fr' ? 'Discussions récentes' : 'Recent Chats'}
          </p>
          {sessions.map((session) => (
            <motion.button
              key={session.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelectSession(session.id);
                onViewChange('chat');
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative",
                currentView === 'chat' && currentSessionId === session.id
                  ? "bg-pastel-blue dark:bg-slim-blue/20 text-slim-blue font-medium"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              {currentView === 'chat' && currentSessionId === session.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-slim-blue rounded-r-full"
                />
              )}
              <MessageSquare
                size={16}
                className={cn(
                  "transition-colors",
                  currentView === 'chat' && currentSessionId === session.id
                    ? "text-slim-blue"
                    : "text-slate-400 group-hover:text-slim-blue"
                )}
              />
              <span className="truncate flex-1 text-left">{session.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <button
          onClick={() => onViewChange('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
            currentView === 'settings'
              ? "bg-pastel-blue dark:bg-slim-blue/20 text-slim-blue font-medium"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <Settings size={18} className={currentView === 'settings' ? "text-slim-blue" : "text-slate-400"} />
          <span>{t.settings}</span>
        </button>
        <button
          onClick={() => onViewChange('profile')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
            currentView === 'profile'
              ? "bg-pastel-blue dark:bg-slim-blue/20 text-slim-blue font-medium"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <User size={18} className={currentView === 'profile' ? "text-slim-blue" : "text-slate-400"} />
          <span>{t.profile}</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <LogOut size={18} />
          <span>{t.logout}</span>
        </button>
      </div>
    </aside>
  );
}
