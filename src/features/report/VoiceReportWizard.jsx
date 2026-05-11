import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Mic, Phone, User, Users } from "lucide-react";
import { toast } from "sonner";
import speechService from "../../services/speechService";
import VoiceInput from "./VoiceInput";
import { aiService } from "../../services/api";

const normalizeEthiopianMobile = (value) => {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.startsWith("00")) digits = digits.slice(2);

  if (digits.startsWith("251") && digits.length === 12 && /^251[79]\d{8}$/.test(digits)) {
    return `0${digits.slice(3)}`;
  }

  if (digits.length === 9 && /^[79]\d{8}$/.test(digits)) {
    return `0${digits}`;
  }

  if (digits.length === 10 && /^0[79]\d{8}$/.test(digits)) {
    return digits;
  }

  return "";
};

const RELATION_OPTIONS = [
  { value: "parent", en: "Parent / Guardian", am: "ወላጅ / አሳዳጊ" },
  { value: "spouse", en: "Spouse / Partner", am: "ባል/ሚስት / ጓደኛ" },
  { value: "sibling", en: "Sibling", am: "ወንድም/እህት" },
  { value: "child", en: "Child", am: "ልጅ" },
  { value: "relative", en: "Other relative", am: "ሌላ ዘመድ" },
  { value: "friend", en: "Friend", am: "ጓደኛ" },
  { value: "neighbor", en: "Neighbor", am: "ጎረቤት" },
  { value: "witness", en: "Witness", am: "ምስክር" },
  { value: "other", en: "Other", am: "ሌላ" },
];

const speak = (text, language) =>
  new Promise((resolve) => {
    speechService.setLanguage(language);
    speechService.speak(text, language, resolve);
  });

const listenOnce = (language) =>
  new Promise((resolve, reject) => {
    speechService.setLanguage(language);
    const ok = speechService.startListening(
      (result) => resolve(String(result || "").trim()),
      (err) => reject(err),
    );
    if (!ok) reject("not_supported");
  });

const isEmpty = (v) => !String(v || "").trim();

export default function VoiceReportWizard({
  language = "en",
  onApplyDraft,
  onSubmit,
  photoPreview,
}) {
  const locale = language === "am" ? "am-ET" : "en-US";
  const [voiceText, setVoiceText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [answers, setAnswers] = useState({
    missingPersonName: "",
    lastSeenLocation: "",
    description: "",
    reporterName: "",
    reporterPhone: "",
    reporterRelation: "",
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, []);

  const relationLabel = useMemo(() => {
    const match = RELATION_OPTIONS.find((r) => r.value === answers.reporterRelation);
    if (!match) return "";
    return language === "am" ? match.am : match.en;
  }, [answers.reporterRelation, language]);

  const apply = (patch) => {
    setAnswers((cur) => {
      const next = { ...cur, ...patch };
      onApplyDraft?.(next);
      return next;
    });
  };

  const handleExtract = async () => {
    const content = voiceText || answers.description;
    if (!content.trim() && !photoPreview) {
      toast.error(language === "am" ? "መጀመሪያ ድምጽ ወይም ፎቶ ያክሉ" : "Add voice or photo first.");
      return;
    }

    setExtracting(true);
    try {
      const response = await aiService.extractInfo({
        text: content || undefined,
        imageBase64:
          typeof photoPreview === "string"
            ? photoPreview.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "")
            : undefined,
        language,
      });

      const extracted = response?.data || response;
      apply({
        missingPersonName: extracted?.name || answers.missingPersonName,
        lastSeenLocation: extracted?.lastSeenLocation || answers.lastSeenLocation,
        description: answers.description || extracted?.description || content,
      });
    } catch (e) {
      toast.error(language === "am" ? "AI ማውጣት አልተሳካም" : "AI extraction failed.");
    } finally {
      setExtracting(false);
    }
  };

  const askAndFill = async ({ key, promptAm, promptEn, parser }) => {
    const prompt = language === "am" ? promptAm : promptEn;
    await speak(prompt, locale);
    const raw = await listenOnce(locale);
    const value = parser ? parser(raw) : raw;
    apply({ [key]: value });
  };

  const collectMissing = async () => {
    if (!speechService.isSupported()) {
      toast.error(
        language === "am"
          ? "የድምጽ መነጋገር በዚህ አሳሽ አይደገፍም"
          : "Voice features are not supported in this browser.",
      );
      return;
    }

    setCollecting(true);
    try {
      // Ensure we have some description first (from voice)
      if (isEmpty(answers.description) && !isEmpty(voiceText)) {
        apply({ description: voiceText });
      }

      if (isEmpty(answers.missingPersonName)) {
        await askAndFill({
          key: "missingPersonName",
          promptAm: "የጠፋው ሰው ሙሉ ስም ምንድነው?",
          promptEn: "What is the missing person's full name?",
        });
      }

      if (isEmpty(answers.lastSeenLocation)) {
        await askAndFill({
          key: "lastSeenLocation",
          promptAm: "ለመጨረሻ ጊዜ የታዩበት ቦታ የት ነው?",
          promptEn: "Where were they last seen?",
        });
      }

      if (isEmpty(answers.reporterName)) {
        await askAndFill({
          key: "reporterName",
          promptAm: "እባክዎ ስምዎን ይናገሩ።",
          promptEn: "Please say your name.",
        });
      }

      if (isEmpty(answers.reporterPhone)) {
        await askAndFill({
          key: "reporterPhone",
          promptAm: "እባክዎ ስልክ ቁጥርዎን ይናገሩ።",
          promptEn: "Please say your phone number.",
          parser: (raw) => {
            // Try to normalize Ethiopian numbers, otherwise keep raw
            const normalized = normalizeEthiopianMobile(raw);
            return normalized || raw;
          },
        });
      }

      if (isEmpty(answers.reporterRelation)) {
        const relationPrompt =
          language === "am"
            ? "ከጠፋው ሰው ጋር ያለዎት ግንኙነት ምንድነው? ለምሳሌ ወላጅ፣ ጓደኛ፣ ጎረቤት ወይም ምስክር።"
            : "What is your relationship to the missing person? For example parent, friend, neighbor, or witness.";
        await speak(relationPrompt, locale);
        const raw = await listenOnce(locale);
        const lower = raw.toLowerCase();
        const guess =
          RELATION_OPTIONS.find((opt) => lower.includes(opt.en.toLowerCase()))?.value ||
          RELATION_OPTIONS.find((opt) => lower.includes(opt.am))?.value ||
          "other";
        apply({ reporterRelation: guess });
      }

      await speak(
        language === "am"
          ? "እናመሰግናለን። አሁን ሪፖርቱን ማስገባት ይችላሉ።"
          : "Thank you. You can submit the report now.",
        locale,
      );
    } catch (e) {
      toast.error(language === "am" ? "የድምጽ ጥያቄ አልተሳካም" : "Voice follow-up failed.");
    } finally {
      if (mountedRef.current) setCollecting(false);
    }
  };

  const canSubmit =
    !isEmpty(answers.missingPersonName) &&
    !isEmpty(answers.lastSeenLocation) &&
    !isEmpty(answers.reporterName) &&
    !isEmpty(answers.reporterPhone) &&
    !isEmpty(answers.reporterRelation);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-warm-gray/40 bg-cream p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-terracotta/10 flex items-center justify-center">
            <Mic className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal">
              {language === "am" ? "የድምጽ ሪፖርት" : "Voice report"}
            </p>
            <p className="text-xs text-stone">
              {language === "am"
                ? "በድምጽ ይናገሩ፤ እኛ ቀጣይ ጥያቄዎችን እንጠይቃለን።"
                : "Speak naturally; we’ll ask follow-up questions by voice."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-warm-gray/40 bg-warm-white p-6">
        <p className="text-sm font-semibold text-charcoal mb-3">
          {language === "am" ? "መጀመሪያ መግለጫ" : "Initial description"}
        </p>
        <VoiceInput
          language={locale}
          onTranscript={(text) => {
            setVoiceText(text);
            if (isEmpty(answers.description)) apply({ description: text });
          }}
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExtract}
            disabled={extracting}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-terracotta text-white font-semibold disabled:opacity-60"
          >
            {extracting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {language === "am" ? "AI መረጃ አውጣ" : "AI extract"}
          </button>

          <button
            type="button"
            onClick={collectMissing}
            disabled={collecting}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-warm-gray text-charcoal font-semibold disabled:opacity-60"
          >
            {collecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
            {language === "am" ? "ቀጣይ ጥያቄዎች (በድምጽ)" : "Follow-up questions (voice)"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-warm-gray/40 bg-cream p-6">
        <p className="text-sm font-semibold text-charcoal mb-4">
          {language === "am" ? "አጭር ማጠቃለያ" : "Quick review"}
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-stone">{language === "am" ? "ስም" : "Name"}</p>
            <p className="font-semibold text-charcoal">{answers.missingPersonName || "—"}</p>
          </div>
          <div>
            <p className="text-stone">{language === "am" ? "ቦታ" : "Location"}</p>
            <p className="font-semibold text-charcoal">{answers.lastSeenLocation || "—"}</p>
          </div>
          <div>
            <p className="text-stone">{language === "am" ? "የእርስዎ ስም" : "Your name"}</p>
            <p className="font-semibold text-charcoal">{answers.reporterName || "—"}</p>
          </div>
          <div>
            <p className="text-stone">{language === "am" ? "ስልክ" : "Phone"}</p>
            <p className="font-semibold text-charcoal">{answers.reporterPhone || "—"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-stone">{language === "am" ? "ግንኙነት" : "Relationship"}</p>
            <p className="font-semibold text-charcoal">{relationLabel || "—"}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-hope-green text-white font-semibold disabled:opacity-60"
          >
            <Phone className="w-4 h-4" />
            {language === "am" ? "ሪፖርት አስገባ" : "Submit report"}
          </button>
          {!canSubmit ? (
            <p className="text-xs text-stone self-center">
              {language === "am"
                ? "ስም፣ ቦታ፣ ስምዎ፣ ስልክ እና ግንኙነት ያስፈልጋሉ።"
                : "Name, location, your name, phone, and relationship are required."}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

