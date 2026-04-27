import { useState } from "react";
import { Bot, Loader2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { aiService } from "../services/api";
import { useLanguage } from "../lib/i18n";
import { useAuth } from "../hooks/useAuth";
import { isAdminRole } from "../lib/authRoles";

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
  const canVerifyFaces = isAdminRole(user?.role);

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
      const payload = response.data || response;
      setAssistantMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            payload?.text ||
            payload?.message ||
            "The assistant did not return structured guidance.",
        },
      ]);
    } catch {
      toast.error("AI assistant request failed.");
    } finally {
      setAssistantLoading(false);
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

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">
            AI Desk
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-charcoal">
            Global AI support for reporting, extraction, and verification
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone">
            This desk connects directly to the backend AI assistant, extraction,
            and face verification routes so the missing-person workflow can be
            guided from one place.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-terracotta" />
              <h2 className="text-xl font-semibold text-charcoal">
                Assistant chat
              </h2>
            </div>
            <div className="mt-5 space-y-3 rounded-3xl bg-stone-50 p-4">
              {assistantMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-auto bg-terracotta text-white"
                      : "bg-white text-stone-800"
                  }`}
                >
                  {message.text}
                  <div className="mt-2 text-[11px] opacity-70">
                    {message.text.length} chars
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <textarea
                value={assistantInput}
                onChange={(event) => setAssistantInput(event.target.value)}
                rows={3}
                placeholder="Ask the AI what to do next..."
                className="flex-1 rounded-3xl border border-stone-200 px-4 py-4 text-sm outline-none focus:border-terracotta"
              />
              <button
                type="button"
                onClick={handleAssistant}
                disabled={assistantLoading}
                className="h-fit rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90 disabled:opacity-60"
              >
                {assistantLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-terracotta" />
              <h2 className="text-xl font-semibold text-charcoal">
                Structured extraction
              </h2>
            </div>
            <textarea
              value={extractInput}
              onChange={(event) => setExtractInput(event.target.value)}
              rows={7}
              placeholder="Paste a report like: My 8-year-old son in a red hoodie was last seen near Bole Medhanialem..."
              className="mt-5 w-full rounded-3xl border border-stone-200 px-4 py-4 text-sm outline-none focus:border-terracotta"
            />
            <button
              type="button"
              onClick={handleExtract}
              disabled={extractLoading}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta disabled:opacity-60"
            >
              {extractLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Extract details
            </button>
            {extractResult ? (
              <>
                <p className="mt-4 text-xs text-stone-500">
                  Characters returned: {JSON.stringify(extractResult).length}
                </p>
                <pre className="mt-2 overflow-x-auto rounded-3xl bg-stone-50 p-4 text-xs leading-6 text-stone-700">
                  {JSON.stringify(extractResult, null, 2)}
                </pre>
              </>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-terracotta" />
              <h2 className="text-xl font-semibold text-charcoal">
                Face verification
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500 transition hover:border-terracotta/30 hover:text-terracotta">
                {verifyFiles.file1 ? verifyFiles.file1.name : "Upload original image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    setVerifyFiles((current) => ({
                      ...current,
                      file1: event.target.files?.[0] || null,
                    }))
                  }
                />
              </label>
              <label className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500 transition hover:border-terracotta/30 hover:text-terracotta">
                {verifyFiles.file2 ? verifyFiles.file2.name : "Upload comparison image"}
                <input
                  type="file"
                  accept="image/*"
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
              className="mt-4 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay disabled:opacity-60"
            >
              {verifyLoading
                ? "Verifying..."
                : canVerifyFaces
                  ? "Run face verification"
                  : "Admin only"}
            </button>

            {!canVerifyFaces ? (
              <p className="mt-3 text-sm text-stone-500">
                Face verification is restricted to admin and coordinator accounts.
              </p>
            ) : null}

            {verifyResult ? (
              <pre className="mt-4 overflow-x-auto rounded-3xl bg-stone-50 p-4 text-xs leading-6 text-stone-700">
                {JSON.stringify(verifyResult, null, 2)}
              </pre>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIDeskPage;
