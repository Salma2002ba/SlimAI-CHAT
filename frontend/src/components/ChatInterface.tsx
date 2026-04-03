import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, User, Bot, Copy, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import { Message, Language } from "../types";
import { translations } from "../translations";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  language: Language;
}

export default function ChatInterface({ messages, onSendMessage, isTyping, language }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[language].chat;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pastel-blue rounded-full blur-[120px] opacity-50 pointer-events-none dark:opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pastel-pink rounded-full blur-[120px] opacity-50 pointer-events-none dark:opacity-20" />
      <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-pastel-green rounded-full blur-[100px] opacity-30 pointer-events-none dark:opacity-10" />

      {/* Header */}
      <header className="h-16 border-b border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-slim-blue to-slim-green p-[2px]">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
              <Bot className="text-slim-blue" size={20} />
            </div>
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-800 dark:text-white">SlimAI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {language === 'fr' ? 'En ligne' : 'Online & Ready'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
            <RotateCcw size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
            <Sparkles size={18} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8 z-0 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 rounded-3xl bg-linear-to-br from-slim-blue via-slim-pink to-slim-green p-0.5 mb-8 animate-float"
            >
              <div className="w-full h-full rounded-[22px] bg-white dark:bg-slate-900 flex items-center justify-center">
                <Bot className="text-slim-blue" size={40} />
              </div>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-4"
            >
              {language === 'fr' ? 'Comment puis-je vous aider ?' : 'How can I help you today?'}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 dark:text-slate-400 mb-12 leading-relaxed"
            >
              {language === 'fr'
                ? "Je suis SlimAI, votre compagnon intelligent. Posez-moi n'importe quelle question, de l'écriture créative aux problèmes de codage complexes."
                : "I'm SlimAI, your intelligent companion. Ask me anything from creative writing to complex coding problems."}
            </motion.p>

            <div className="grid grid-cols-2 gap-4 w-full">
              {(language === 'fr'
                ? [
                    "Écris un poème sur le printemps",
                    "Explique l'informatique quantique",
                    "Aide-moi à planifier un voyage à Paris",
                    "Donne-moi une recette saine"
                  ]
                : [
                    "Write a poem about spring",
                    "Explain quantum computing",
                    "Help me plan a trip to Paris",
                    "Give me a healthy recipe"
                  ]).map((suggestion, i) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => onSendMessage(suggestion)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:border-slim-blue hover:shadow-lg hover:shadow-slim-blue/5 transition-all text-left"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                    delay: 0.05
                  }}
                  layout
                  className={cn(
                    "flex gap-4 group",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={cn(
                      "w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-sm transition-transform",
                      message.role === "user"
                        ? "bg-slim-pink text-white"
                        : "bg-white dark:bg-slate-800 text-slim-blue border border-slate-100 dark:border-slate-700"
                    )}
                  >
                    {message.role === "user" ? <User size={20} /> : <Bot size={20} />}
                  </motion.div>
                  <div
                    className={cn(
                      "flex flex-col gap-2 max-w-[80%]",
                      message.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-xs transition-all",
                        message.role === "user"
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-tr-none hover:bg-slate-800 dark:hover:bg-slate-100"
                          : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none hover:border-slim-blue/30"
                      )}
                    >
                      <div className="markdown-body prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {message.role === "model" && (
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-slate-300 hover:text-slim-blue transition-all">
                            <Copy size={12} />
                          </button>
                          <button className="p-1 text-slate-300 hover:text-slim-green transition-all">
                            <ThumbsUp size={12} />
                          </button>
                          <button className="p-1 text-slate-300 hover:text-slim-pink transition-all">
                            <ThumbsDown size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-slim-blue border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm animate-pulse">
                  <Bot size={20} />
                </div>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-100 dark:border-slate-700 px-6 py-4 rounded-3xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1.5">
                    <motion.span
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-1.5 h-1.5 bg-slim-blue rounded-full"
                    />
                    <motion.span
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-slim-pink rounded-full"
                    />
                    <motion.span
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-slim-green rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-8 bg-linear-to-t from-slate-50 dark:from-slate-950 via-slate-50 dark:via-slate-950 to-transparent z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 pr-16 text-sm focus:outline-hidden focus:ring-4 focus:ring-slim-blue/10 focus:border-slim-blue/30 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none text-slate-900 dark:text-white"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim() || isTyping}
              className={cn(
                "absolute right-2 p-3 rounded-xl transition-all",
                input.trim() && !isTyping
                  ? "bg-slim-blue text-white shadow-lg shadow-slim-blue/20 hover:bg-slim-blue/90"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              )}
            >
              <Send size={20} />
            </motion.button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
            {language === 'fr'
              ? 'SlimAI peut faire des erreurs. Vérifiez les informations importantes.'
              : 'SlimAI can make mistakes. Check important info.'}
          </p>
          <p className="text-center text-[9px] text-slate-400/70 mt-2 font-mono tracking-tight">
            React · Vite · FastAPI · PostgreSQL · RAG (BM25) · Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}

