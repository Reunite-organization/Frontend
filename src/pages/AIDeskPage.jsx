import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Send,
  User,
  ArrowDown,
  Image as ImageIcon,
  Zap,
  MessageSquare,
  Brain,
  Fingerprint,
  ChevronDown,
  Check,
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
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([
    {
      role: "assistant",
      text:
        language === "am"
          ? "ሪፖርት፣ ማስተባበር ወይም ፍለጋ ያለ ጥያቄ ይጠይቁ።"
          : "Ask for reporting guidance, case triage, volunteer direction, or search support.",
    },
  ]);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [extractInput, setExtractInput] = useState("");
  const [extractResult, setExtractResult] = useState(null);
  const [extractLoading, setExtractLoading] = useState(false);
  const [verifyFiles, setVerifyFiles] = useState({ file1: null, file2: null });
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("assistant");
  const canVerifyFaces = Boolean(user);

  // Refs for auto-scroll
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [assistantMessages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const navigate = useNavigate();

  const sendToReport = () => {
    if (!extractResult) return;

    const reportData = {
      missingPersonName: extractResult.name || "",
      age: extractResult.age || "",
      gender: extractResult.gender || "unknown",
      clothing: extractResult.clothing?.join(", ") || "",
      lastSeenLocation: extractResult.lastSeenLocation || "",
      description: extractInput || "",
    };

    sessionStorage.setItem("prefillReport", JSON.stringify(reportData));

    toast.success(
      language === "am"
        ? "✅ መረጃው ወደ ሪፖርት ቅጽ ተልኳል!"
        : "✅ Details sent to report form!",
    );

    navigate("/report");
  };

  const handleAssistant = async () => {
    const message = assistantInput.trim();
    if (!message) return;

    setAssistantMessages((current) => [
      ...current,
      { role: "user", text: message },
    ]);
    setAssistantInput("");
    setAssistantLoading(true);

    try {
      const response = await aiService.assistant({
        message,
        language,
        context: { page: "ai-desk" },
      });
      const payload = normalizeAssistantResponse(response);
      setAssistantMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: payload.text,
        },
      ]);
    } catch (error) {
      const fallback =
        error?.response?.data?.error ||
        error?.message ||
        "AI assistant request failed.";
      toast.error(fallback);
      setAssistantMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: fallback,
        },
      ]);
    } finally {
      setAssistantLoading(false);
      // Refocus input after response
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Handle Enter key submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAssistant();
    }
  };

  const handleExtract = async () => {
    if (!extractInput.trim()) {
      toast.error("Add text for AI extraction first.");
      return;
    }

    setExtractLoading(true);
    try {
      const response = await aiService.extractInfo({
        text: extractInput,
        language,
      });
      setExtractResult(response.data || response);
    } catch {
      toast.error("AI extraction failed.");
    } finally {
      setExtractLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyFiles.file1 || !verifyFiles.file2) {
      toast.error("Add both images before running face verification.");
      return;
    }

    setVerifyLoading(true);
    try {
      const [imageData1, imageData2] = await Promise.all([
        readFileAsBase64(verifyFiles.file1),
        readFileAsBase64(verifyFiles.file2),
      ]);

      const response = await aiService.verifyFaces({ imageData1, imageData2 });
      setVerifyResult(response.data || response);
    } catch {
      toast.error("Face verification failed.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const tabs = [
    {
      id: "assistant",
      label: language === "am" ? "አሲስታንት" : "Assistant",
      icon: MessageSquare,
    },
    {
      id: "extract",
      label: language === "am" ? "ማውጣት" : "Extraction",
      icon: Brain,
    },
    {
      id: "verify",
      label: language === "am" ? "ማረጋገጫ" : "Verification",
      icon: Fingerprint,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Header */}
      <section className="relative border-b border-stone-200 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-white/90 dark:bg-[#3d3535]" />
        <div className="absolute inset-0 opacity-[0.03]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">
                {language === "am" ? "የእርዳታ ዴስክ" : "AI Help Desk"}
              </p>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-600 dark:text-gray-200">
            {language === "am"
              ? "ለሪፖርት ፣ ማውጣት እና ማረጋገጫ AI ድጋፍ"
              : "AI support for reporting, extraction, and verification"}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-200">
            {language === "am"
              ? "ይህ ዴስክ ከ AI ረዳት ፣ መረጃ ማውጫ እና የፊት ማረጋገጫ ጋር በቀጥታ ይገናኛል።"
              : "Connect directly to AI assistant, data extraction, and face verification tools."}
          </p>
        </div>
      </section>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200">
        <div className="flex gap-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-stone-900 text-white shadow-lg"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Assistant Chat - Always visible on desktop, tab on mobile */}
          <div
            className={`space-y-6 ${activeTab === "assistant" ? "block" : "hidden lg:block"}`}
          >
            {/* Chat Card */}
            <div className="rounded-3xl border border-stone-200 bg-white shadow-sm overflow-hidden flex flex-col h-[600px] lg:h-[700px]">
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100 bg-white ">
                <div className="w-10 h-10 bg-teal-700 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">
                    {language === "am" ? "AI ረዳት" : "AI Assistant"}
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {language === "am" ? "በቀጥታ ንቁ" : "Always active"}
                  </p>
                </div>
                <div className="ml-auto text-xs text-stone-400">
                  {assistantMessages.length}{" "}
                  {language === "am" ? "መልዕክቶች" : "messages"}
                </div>
              </div>

              {/* Messages Container - Auto-scrollable */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-stone-50/50 dark:bg-gray-700"
              >
                {assistantMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-[#2c2c2e] text-[#F9FAFB]"
                          : "bg-white text-stone-800 border border-stone-200 dark:text-white shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === "assistant" ? (
                          <Bot className="w-3.5 h-3.5 text-terracotta" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-white/70" />
                        )}
                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                          {message.role === "assistant" ? "AI" : "You"}
                        </span>
                      </div>
                      <div className="text-sm leading-6 prose prose-sm max-w-none">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {assistantLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-terracotta" />
                        <span className="text-sm text-stone-500">
                          {language === "am" ? "እያሰብኩ ነው..." : "Thinking..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-scroll anchor */}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-stone-100 bg-white">
                <div className="flex gap-3">
                  <textarea
                    ref={inputRef}
                    value={assistantInput}
                    onChange={(event) => setAssistantInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    placeholder={
                      language === "am"
                        ? "ጥያቄዎን ይጻፉ... (ለመላክ Enter ይጫኑ)"
                        : "Type your question... (Press Enter to send, Shift+Enter for new line)"
                    }
                    className="flex-1 rounded-2xl border-2 border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleAssistant}
                    disabled={assistantLoading || !assistantInput.trim()}
                    className="self-end px-4 py-3 bg-terracotta text-white rounded-2xl font-semibold text-sm hover:from-terracotta hover:to-amber-700 disabled:opacity-50 transition-all shadow-lg shadow-terracotta/20 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
                <p className="mt-2 text-xs text-stone-400 flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-semibold">
                    Enter
                  </span>
                  {language === "am" ? "ለመላክ" : "to send"}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-semibold ml-2">
                    Shift + Enter
                  </span>
                  {language === "am" ? "አዲስ መስመር" : "new line"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Extract & Verify */}
          <div className="space-y-6">
            {/* Extraction Card */}
            <div
              className={`${activeTab === "extract" ? "block" : "hidden lg:block"}`}
            >
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900">
                      {language === "am" ? "መረጃ ማውጣት" : "Structured Extraction"}
                    </h2>
                    <p className="text-xs text-stone-500">
                      {language === "am"
                        ? "AI ከጽሁፍ መረጃ ያወጣል"
                        : "AI extracts details from text"}
                    </p>
                  </div>
                </div>

                <textarea
                  value={extractInput}
                  onChange={(event) => setExtractInput(event.target.value)}
                  rows={6}
                  placeholder={
                    language === "am"
                      ? "ለምሳሌ፡ የ8 ዓመት ልጄ በቀይ ሸሚዝ ቦሌ ሜድሃንያለም አካባቢ ለመጨረሻ ጊዜ ታይቷል..."
                      : "e.g., My 8-year-old son in a red hoodie was last seen near Bole Medhanialem..."
                  }
                  className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3.5 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all resize-none"
                />

                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={extractLoading}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-clay hover:via-clay-light text-white rounded-2xl text-sm font-semibold  disabled:opacity-50 transition-al"
                >
                  {extractLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {language === "am" ? "መረጃ አውጣ" : "Extract Details"}
                </button>

                {extractResult && (
                  <div className="mt-4 space-y-3">
                    {/* User-friendly extraction results */}
                    <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                      <p className="text-sm font-semibold text-purple-900 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {language === "am"
                          ? "AI ያወጣቸው መረጃዎች"
                          : "AI Extracted Details"}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {/* Name */}
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                            {language === "am" ? "ስም" : "Name"}
                          </p>
                          <p className="text-sm font-semibold text-stone-900">
                            {extractResult.name || (
                              <span className="text-stone-400 font-normal italic">
                                {language === "am" ? "አልተገኘም" : "Not found"}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Age */}
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                            {language === "am" ? "ዕድሜ" : "Age"}
                          </p>
                          <p className="text-sm font-semibold text-stone-900">
                            {extractResult.age || (
                              <span className="text-stone-400 font-normal italic">
                                {language === "am" ? "አልተገኘም" : "Not found"}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Gender */}
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                            {language === "am" ? "ጾታ" : "Gender"}
                          </p>
                          <p className="text-sm font-semibold text-stone-900 capitalize">
                            {extractResult.gender || (
                              <span className="text-stone-400 font-normal italic">
                                {language === "am" ? "አልተገኘም" : "Not found"}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Clothing */}
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                            {language === "am" ? "አለባበስ" : "Clothing"}
                          </p>
                          <p className="text-sm font-semibold text-stone-900">
                            {extractResult.clothing?.length > 0 ? (
                              extractResult.clothing.join(", ")
                            ) : (
                              <span className="text-stone-400 font-normal italic">
                                {language === "am" ? "አልተገኘም" : "Not found"}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Location */}
                        <div className="sm:col-span-2 bg-white rounded-xl p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                            {language === "am"
                              ? "የታዩበት ቦታ"
                              : "Last Seen Location"}
                          </p>
                          <p className="text-sm font-semibold text-stone-900">
                            {extractResult.lastSeenLocation || (
                              <span className="text-stone-400 font-normal italic">
                                {language === "am" ? "አልተገኘም" : "Not found"}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Time */}
                        {extractResult.lastSeenTime && (
                          <div className="bg-white rounded-xl p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                              {language === "am" ? "ሰዓት" : "Time"}
                            </p>
                            <p className="text-sm font-semibold text-stone-900">
                              {extractResult.lastSeenTime}
                            </p>
                          </div>
                        )}

                        {/* Distinguishing Features */}
                        {extractResult.distinguishingFeatures?.length > 0 && (
                          <div className="sm:col-span-2 bg-white rounded-xl p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                              {language === "am"
                                ? "መለያ ምልክቶች"
                                : "Distinguishing Features"}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {extractResult.distinguishingFeatures.map(
                                (feature, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs"
                                  >
                                    {feature}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* Urgency Indicators */}
                        {extractResult.urgencyIndicators?.length > 0 && (
                          <div className="sm:col-span-2 bg-white rounded-xl p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500 mb-1">
                              {language === "am"
                                ? "የአስቸኳይ ምልክቶች"
                                : "Urgency Indicators"}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {extractResult.urgencyIndicators.map(
                                (indicator, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs"
                                  >
                                    {indicator}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confidence Badge */}
                      {extractResult.extractionMetadata && (
                        <div className="mt-4 flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                              extractResult.extractionMetadata
                                .confidenceLevel === "HIGH"
                                ? "bg-emerald-100 text-emerald-700"
                                : extractResult.extractionMetadata
                                      .confidenceLevel === "MEDIUM"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {language === "am" ? "እምነት" : "Confidence"}:{" "}
                            {extractResult.extractionMetadata.confidenceLevel}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={sendToReport}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-terracotta text-white rounded-2xl text-sm font-semibold hover:from-terracotta hover:to-amber-700 transition-all shadow-lg shadow-terracotta/20"
                      >
                        <Send className="w-4 h-4" />
                        {language === "am"
                          ? "ወደ ሪፖርት ቅጽ ላክ"
                          : "Send to Report Form"}
                      </button>
                    </div>

                    <details className="group">
                      <summary className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer hover:text-stone-600 transition-colors">
                        <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                        {language === "am" ? "ጥሬ ውጤት አሳይ" : "Show raw response"}
                      </summary>
                      <pre className="mt-2 rounded-xl bg-stone-100 p-3 text-xs text-stone-600 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                        {JSON.stringify(extractResult, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Card */}
            <div
              className={`${activeTab === "verify" ? "block" : "hidden lg:block"}`}
            >
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900">
                      {language === "am" ? "የፊት ማረጋገጫ" : "Face Verification"}
                    </h2>
                    <p className="text-xs text-stone-500">
                      {language === "am"
                        ? "ሁለት ምስሎችን ያወዳድሩ"
                        : "Compare two images"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-6 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all group">
                    <div className="w-12 h-12 bg-stone-200 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors">
                      <ImageIcon className="w-6 h-6 text-stone-500 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <span className="text-xs text-stone-600 group-hover:text-emerald-700 transition-colors text-center">
                      {verifyFiles.file1
                        ? verifyFiles.file1.name
                        : "Original Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={(event) =>
                        setVerifyFiles((current) => ({
                          ...current,
                          file1: event.target.files?.[0] || null,
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-6 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all group">
                    <div className="w-12 h-12 bg-stone-200 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors">
                      <ImageIcon className="w-6 h-6 text-stone-500 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <span className="text-xs text-stone-600 group-hover:text-emerald-700 transition-colors text-center">
                      {verifyFiles.file2
                        ? verifyFiles.file2.name
                        : "Comparison Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={(event) =>
                        setVerifyFiles((current) => ({
                          ...current,
                          file2: event.target.files?.[0] || null,
                        }))
                      }
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={verifyLoading || !canVerifyFaces}
                  className="mt-4 w-full px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200"
                >
                  {verifyLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === "am" ? "እያረጋገጥኩ ነው..." : "Verifying..."}
                    </span>
                  ) : language === "am" ? (
                    "የፊት ማረጋገጫ አሂድ"
                  ) : (
                    "Run Face Verification"
                  )}
                </button>

                {!canVerifyFaces && (
                  <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {language === "am"
                      ? "እባክዎ ይግቡ"
                      : "Please sign in to verify"}
                  </p>
                )}

                {verifyResult && (
                  <div className="mt-4 space-y-3">
                    {/* User-friendly result message */}
                    <div
                      className={`rounded-2xl border-2 p-4 ${
                        verifyResult.verified
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {verifyResult.verified ? (
                          <>
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Check className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-emerald-900">
                                {language === "am"
                                  ? "✅ ሁለቱም ፎቶዎች አንድ አይነት ሰው ናቸው"
                                  : "✅ Both photos are the same person"}
                              </p>
                              <p className="text-xs text-emerald-700 mt-0.5">
                                {language === "am"
                                  ? "የፊት ማረጋገጫ ተሳክቷል - ፎቶዎቹ ይዛመዳሉ"
                                  : "Face verification successful - Photos match"}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <X className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-red-900">
                                {language === "am"
                                  ? "❌ ሁለቱ ፎቶዎች የተለያዩ ሰዎች ናቸው"
                                  : "❌ The two photos are different people"}
                              </p>
                              <p className="text-xs text-red-700 mt-0.5">
                                {language === "am"
                                  ? "የፊት ማረጋገጫ አልተሳካም - ፎቶዎቹ አይዛመዱም"
                                  : "Face verification failed - Photos don't match"}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Technical details in expandable section */}
                    <details className="group">
                      <summary className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer hover:text-stone-700 transition-colors">
                        <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                        {language === "am"
                          ? "ተጨማሪ ቴክኒካል መረጃ"
                          : "Technical details"}
                      </summary>
                      <div className="mt-2 rounded-xl bg-stone-50 p-3 text-xs text-stone-600 space-y-1.5">
                        <div className="flex justify-between">
                          <span>{language === "am" ? "ሞዴል" : "Model"}:</span>
                          <span className="font-mono text-stone-700">
                            {verifyResult.model || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === "am" ? "ርቀት" : "Distance"}:</span>
                          <span className="font-mono text-stone-700">
                            {verifyResult.distance?.toFixed(4) || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            {language === "am" ? "ገደብ" : "Threshold"}:
                          </span>
                          <span className="font-mono text-stone-700">
                            {verifyResult.threshold || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            {language === "am" ? "�ምነት" : "Confidence"}:
                          </span>
                          <span
                            className={`font-mono font-semibold ${
                              verifyResult.verified
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {verifyResult.distance !== undefined
                              ? `${Math.max(0, Math.min(100, (1 - verifyResult.distance) * 100)).toFixed(1)}%`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIDeskPage;
