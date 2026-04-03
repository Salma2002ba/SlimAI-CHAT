import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import LandingPage from "./components/LandingPage";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import GDPRPopup from "./components/GDPRPopup";
import { ChatSession, Message, AppView, Language, Theme } from "./types";
import { generateChatResponse } from "./services/gemini";
import { translations } from "./translations";

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('chat');
  const [showGDPR, setShowGDPR] = useState(false);
  const [language, setLanguage] = useState<Language>('fr');
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (sessions.length === 0) {
      const newSession: ChatSession = {
        id: crypto.randomUUID(),
        title: language === 'fr' ? "Nouvelle discussion" : "New Chat",
        messages: [],
        lastUpdated: new Date(),
      };
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
    }
  }, [language]);

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const handleEnterChat = (guest: boolean) => {
    setIsGuest(guest);
    setShowChat(true);
    setCurrentView('chat');
    if (!guest) {
      setShowGDPR(true);
    }
  };

  const handleLogout = () => {
    setShowChat(false);
    setIsGuest(false);
    setCurrentView('chat');
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: language === 'fr' ? "Nouvelle discussion" : "New Chat",
      messages: [],
      lastUpdated: new Date(),
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setCurrentView('chat');
  };

  const handleSendMessage = async (text: string) => {
    if (!currentSessionId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      timestamp: new Date(),
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSessionId) {
          const updatedMessages = [...s.messages, userMessage];
          const title = s.messages.length === 0 ? text.slice(0, 30) + (text.length > 30 ? "..." : "") : s.title;
          return { ...s, messages: updatedMessages, title, lastUpdated: new Date() };
        }
        return s;
      })
    );

    setIsTyping(true);

    try {
      const currentMessages = currentSession?.messages || [];
      const responseText = await generateChatResponse([...currentMessages, userMessage], language);

      const modelMessage: Message = {
        id: crypto.randomUUID(),
        role: "model",
        text: responseText,
        timestamp: new Date(),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === currentSessionId) {
            return { ...s, messages: [...s.messages, modelMessage], lastUpdated: new Date() };
          }
          return s;
        })
      );
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileView language={language} />;
      case 'settings':
        return (
          <SettingsView 
            language={language} 
            setLanguage={setLanguage} 
            theme={theme} 
            setTheme={setTheme} 
          />
        );
      case 'chat':
      default:
        return (
          <ChatInterface
            messages={currentSession?.messages || []}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            language={language}
          />
        );
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {!showChat ? (
          <LandingPage key="landing" onEnterChat={handleEnterChat} language={language} />
        ) : (
          <motion.div
            key="chat-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full"
          >
            <Sidebar
              sessions={sessions}
              currentSessionId={currentSessionId}
              currentView={currentView}
              onSelectSession={setCurrentSessionId}
              onNewChat={handleNewChat}
              onViewChange={setCurrentView}
              onLogout={handleLogout}
              language={language}
            />
            <div className="flex-1 h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showGDPR && <GDPRPopup onClose={() => setShowGDPR(false)} language={language} />}
      </AnimatePresence>
    </div>
  );
}

