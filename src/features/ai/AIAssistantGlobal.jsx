import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { aiService, normalizeAssistantResponse } from "@/services/api";
import speechService from "@/services/speechService";

const VoiceIndicator = () => (
  <div className="voice-wave-container px-2">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="voice-bar"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const AIAssistantGlobal = () => {
  const { t, currentLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { id: 0, role: "assistant", text: t("aiWelcome") },
  ]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && isListening) {
      setIsListening(false);
      speechService.stopListening();
    }
  }, [isOpen, isListening]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: "user", text: message },
    ]);
    setQuery("");
    setIsSending(true);

    try {
      const response = await aiService.assistant({
        message,
        language: currentLanguage === "am" ? "am" : "en",
        context: {},
      });

      const reply = normalizeAssistantResponse(response);

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          role: "assistant",
          text: reply.text || "I couldn't process that.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          role: "assistant",
          text:
            error?.message ||
            t("AI Failure Message") ||
            "AI assistant failed. Please try again later.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!speechService.isSupported()) {
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    speechService.setLanguage(currentLanguage);
    setIsListening(true);

    speechService.startListening(
      async (transcript) => {
        setIsListening(false);
        setQuery(transcript);
        await sendMessage(transcript);
      },
      (error) => {
        setIsListening(false);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            role: "assistant",
            text: error || t("aiFailureMessage"),
          },
        ]);
      },
    );
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-colors"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6 md:w-7 md:h-7" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 
                         w-[calc(100vw-2rem)] max-w-[380px] 
                         bg-white rounded-2xl shadow-2xl border border-slate-200 
                         overflow-hidden flex flex-col
                         max-h-[800px] h-[70vh] min-h-[350px]"
            >
              <div className="bg-emerald-600 p-3 md:p-4 text-white flex justify-between items-center flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-semibold text-sm md:text-base">{t("assistant Title")}</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-emerald-500 rounded-full p-1.5 transition-colors"
                  aria-label="Close assistant"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div 
                ref={chatContainerRef}
                className="flex-1 p-3 md:p-4 bg-slate-50 overflow-y-auto overscroll-contain"
              >
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`max-w-[85%] rounded-2xl px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm ${
                        message.role === "assistant"
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-slate-100 text-slate-900 ml-auto"
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                  {isListening && (
                    <div className="flex justify-center py-3">
                      <VoiceIndicator />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-3 md:p-4 bg-white border-t border-slate-100 flex-shrink-0">
                <div className="relative flex items-center bg-slate-100 rounded-full px-3 py-1.5 md:px-4 md:py-2  focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isListening ? t("listening") : t("ask Anything")}
                    className="bg-transparent border-none outline-none focus:outline:none text-sm flex-1 placeholder:text-slate-400 min-w-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage(query);
                      }
                    }}
                    disabled={isSending}
                  />
                  <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
                    <button
                      onClick={handleVoiceToggle}
                      className={`p-2 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        isListening
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "text-slate-400 hover:text-emerald-600"
                      }`}
                      type="button"
                      aria-label={isListening ? "Stop listening" : "Start voice input"}
                    >
                      <Mic className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <Button
                      onClick={() => sendMessage(query)}
                      disabled={isSending || !query.trim()}
                      className="rounded-full bg-emerald-600 text-white px-3 py-2 md:px-4 md:py-2 min-h-[44px] min-w-[44px]"
                      aria-label="Send message"
                    >
                      <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistantGlobal;
