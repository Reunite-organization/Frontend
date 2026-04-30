import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, ImagePlus, Send, Wand2, Loader2 } from "lucide-react";
import api, { normalizeAssistantResponse } from "@/services/api";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";

const AIAssistant = () => {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [assistantReply, setAssistantReply] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async (event) => {
    event.preventDefault();
    if (!message && !imageBase64) {
      toast.error("Provide a message or image to proceed.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/ai/assistant", {
        message,
        language: "en",
        context: { mode: "frontend-assistant" },
        imageData: imageBase64,
      });
      setAssistantReply(normalizeAssistantResponse(response.data));
      toast.success("AI assistant returned guidance.");
    } catch (error) {
      console.error("Assistant error:", error);
      toast.error("AI assistant request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              AI Assistant
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Report faster, triage smarter
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Use voice, text, or image input to let the system extract case
              details, assess priority, and create structured reports from any
              signal.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-semibold">Voice</div>
              <div className="mt-2 text-slate-500">
                Speak the report and convert it into case fields automatically.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-semibold">Text</div>
              <div className="mt-2 text-slate-500">
                Type any missing person detail and let AI build the case
                structure.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-semibold">Image</div>
              <div className="mt-2 text-slate-500">
                Upload a photo or screenshot and let the assistant verify faces
                and privacy risk.
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleTextSubmit} className="mt-8 space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the missing person, last seen location, and urgent details..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Mic className="w-5 h-5" />
                    <span className="font-semibold">Voice Input</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceActive(!voiceActive)}
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                  >
                    {voiceActive ? "Stop" : "Start"}
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Use your microphone for direct report capture.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-slate-800">
                    <ImagePlus className="w-5 h-5" />
                    <span className="font-semibold">Image Upload</span>
                  </div>
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Choose
                  </label>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
                <p className="mt-3 text-sm text-slate-600">
                  Select a screenshot or photo to verify privacy and identify
                  faces.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              AI assistant can create cases, summarize reports, and highlight
              priority signals.
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}{" "}
              Send to Assistant
            </button>
          </div>
        </form>

        {assistantReply && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Assistant Response
            </div>
            <div className="mt-4 text-sm leading-7 text-slate-700">
              {assistantReply.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
