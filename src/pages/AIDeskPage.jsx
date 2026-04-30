import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Loader2,
  Sparkles,
  Send,
  User,
  Image as ImageIcon,
  MessageSquare,
  Brain,
  Fingerprint,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { aiService, normalizeAssistantResponse } from "../services/api";
import { useLanguage } from "../lib/i18n";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const AIDeskPage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([
    {
      role: "assistant",
      text: language === "am" ? "ጥያቄ ይጠይቁ..." : "Ask anything...",
    },
  ]);
  const [assistantLoading, setAssistantLoading] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [assistantMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAssistant = async () => {
    const message = assistantInput.trim();
    if (!message) return;

    setAssistantMessages((c) => [...c, { role: "user", text: message }]);
    setAssistantInput("");
    setAssistantLoading(true);

    try {
      const res = await aiService.assistant({ message, language });
      const payload = normalizeAssistantResponse(res);

      setAssistantMessages((c) => [
        ...c,
        { role: "assistant", text: payload.text },
      ]);
    } catch {
      toast.error("AI failed");
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white dark:from-stone-900 dark:to-stone-950 transition-colors">
      {/* HEADER */}
      <section className="border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            AI Help Desk
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            AI assistant, extraction, and verification tools
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
        {/* CHAT */}
        <div className=" dark:border-3 flex flex-col h-[650px] rounded-3xl border border-stone-200 dark:border-orange-700 bg-white dark:bg-orange-900 shadow-sm dark:shadow-none">
          {/* CHAT HEADER */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-200 dark:border-stone-700">
            <Bot className="text-terracotta" />
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              AI Assistant
            </span>
          </div>

          {/* MESSAGES */}
          <div className="dark:border-3 flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-stone-50 dark:bg-stone-800/50">
            {assistantMessages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : ""}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-stone-900 text-white"
                      : "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  }`}
                >
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {assistantLoading && (
              <Loader2 className="animate-spin text-stone-400" />
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-4 border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 flex gap-3">
            <textarea
              ref={inputRef}
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 px-3 py-2 outline-none"
              placeholder="Type..."
            />

            <button
              onClick={handleAssistant}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-500/90"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE (example card) */}
        <div className="rounded-3xl border dark:border-3 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 shadow-sm dark:shadow-none">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3">
            Extraction
          </h2>

          <textarea
            className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 px-3 py-2"
            rows={5}
            placeholder="Paste text..."
          />

          <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600">
            Extract
          </button>
        </div>
      </section>
    </div>
  );
};

export default AIDeskPage;
