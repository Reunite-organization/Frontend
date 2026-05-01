import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  MapPin,
  Mic,
  Sparkles,
  Upload,
  User,
  Phone,
  Calendar,
  Clock,
  Shield,
  AlertCircle,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import api, { aiService } from "../services/api";
import { useLanguage } from "../lib/i18n";
import { parseCommaSeparated } from "../lib/caseFormatting";
import VoiceInput from "../features/report/VoiceInput";
import { geocodeLocation } from "../services/locationService";

const initialForm = {
  missingPersonName: "",
  age: "",
  gender: "unknown",
  clothing: "",
  description: "",
  lastSeenLocation: "",
  lastSeenDate: "",
  reporterName: "",
  reporterPhone: "",
  reporterRelation: "",
  smsPhone: "",
  customRelation: "",
};

const RELATIONSHIP_OPTIONS = [
  { value: "parent", label: "Parent / Guardian" },
  { value: "spouse", label: "Spouse / Partner" },
  { value: "sibling", label: "Sibling" },
  { value: "child", label: "Child" },
  { value: "relative", label: "Other Relative" },
  { value: "friend", label: "Friend" },
  { value: "colleague", label: "Colleague" },
  { value: "neighbor", label: "Neighbor" },
  { value: "caregiver", label: "Caregiver / Nurse" },
  { value: "teacher", label: "Teacher / Educator" },
  { value: "witness", label: "Witness" },
  { value: "other", label: "Other" },
];

const normalizeEthiopianMobile = (value) => {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

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

export const ReportCasePage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [voiceText, setVoiceText] = useState("");
  const [resolvedLocation, setResolvedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [resolvingLocation, setResolvingLocation] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [activeSection, setActiveSection] = useState("person");
  const [validationErrors, setValidationErrors] = useState({});

  // Validation function
  const validateSection = (sectionId) => {
    const errors = {};

    if (sectionId === "person") {
      if (!form.missingPersonName.trim()) {
        errors.missingPersonName =
          language === "am" ? "ስም ያስፈልጋል" : "Name is required";
      }
      if (!form.age || isNaN(form.age) || form.age < 0 || form.age > 120) {
        errors.age =
          language === "am" ? "ትክክለኛ ዕድሜ ያስፈልጋል" : "Valid age required (0-120)";
      }
    }

    if (sectionId === "incident") {
      if (!form.lastSeenLocation.trim()) {
        errors.lastSeenLocation =
          language === "am" ? "ቦታ ያስፈልጋል" : "Location is required";
      }
      if (!form.lastSeenDate) {
        errors.lastSeenDate =
          language === "am" ? "ቀን ያስፈልጋል" : "Date and time is required";
      }
      if (!form.description.trim()) {
        errors.description =
          language === "am" ? "መግለጫ ያስፈልጋል" : "Description is required";
      }
    }

    if (sectionId === "reporter") {
      if (!form.reporterName.trim()) {
        errors.reporterName =
          language === "am" ? "ስምዎ ያስፈልጋል" : "Your name is required";
      }
      if (!form.reporterPhone.trim()) {
        errors.reporterPhone =
          language === "am" ? "ስልክ ቁጥር ያስፈልጋል" : "Phone number is required";
      }
      if (!form.reporterRelation.trim()) {
        errors.reporterRelation =
          language === "am" ? "ግንኙነት ያስፈልጋል" : "Relationship is required";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear field error when user types
  const clearFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const helperText = useMemo(
    () =>
      language === "am"
        ? "ይህ ሪፖርት በቀጥታ ወደ የጠፉ ሰዎች ምላሽ ስርዓት ይገባል፣ በአማርኛ ድምጽ-ወደ-ጽሑፍ እና የአድራሻ ፍለጋ"
        : "This report goes directly into the missing-person response workflow with voice-to-text and address-based map lookup.",
    [language],
  );

  const updateField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleResolveLocation = async () => {
    if (!form.lastSeenLocation.trim()) {
      toast.error("Add the reported location first.");
      return;
    }

    setResolvingLocation(true);
    try {
      const result = await geocodeLocation(form.lastSeenLocation);
      setResolvedLocation(result);
      updateField("lastSeenLocation", result.address || form.lastSeenLocation);
      toast.success("Location found on the map.");
    } catch {
      toast.error("Unable to find that location yet.");
    } finally {
      setResolvingLocation(false);
    }
  };

  const handleAiExtract = async () => {
    const content = voiceText || form.description;
    if (!content.trim()) {
      toast.error("Add a description or voice note first.");
      return;
    }

    setExtracting(true);
    try {
      const response = await aiService.extractInfo({
        text: content,
        language,
      });

      const extracted = response.data || response;
      setAiPreview(extracted);

      updateField(
        "missingPersonName",
        extracted.name || form.missingPersonName,
      );
      updateField("age", extracted.age ? String(extracted.age) : form.age);
      updateField(
        "lastSeenLocation",
        extracted.lastSeenLocation || form.lastSeenLocation,
      );
      updateField(
        "clothing",
        extracted.clothing?.length
          ? extracted.clothing.join(", ")
          : form.clothing,
      );
      updateField("gender", extracted.gender || form.gender);

      toast.success("AI details extracted into the report.");
    } catch {
      toast.error("AI extraction failed.");
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.missingPersonName.trim() ||
      !form.lastSeenLocation.trim() ||
      !form.reporterName.trim() ||
      !form.reporterPhone.trim() ||
      !form.reporterRelation.trim()
    ) {
      toast.error(
        "Missing person name, last seen location, reporter name, phone, and relationship are required.",
      );
      return;
    }

    const normalizedSmsPhone = form.smsPhone.trim()
      ? normalizeEthiopianMobile(form.smsPhone)
      : "";

    if (form.smsPhone.trim() && !normalizedSmsPhone) {
      toast.error("Enter a valid SMS number, for example 0911223344 or 0711223344.");
      return;
    }

    setLoading(true);
    try {
      let locationForSubmit = resolvedLocation;

      if (!locationForSubmit) {
        try {
          locationForSubmit = await geocodeLocation(form.lastSeenLocation);
          setResolvedLocation(locationForSubmit);
        } catch {
          locationForSubmit = null;
        }
      }

      const payload = new FormData();
      const formToSubmit = { ...form, smsPhone: normalizedSmsPhone };

      if (form.reporterRelation === "other" && form.customRelation) {
        formToSubmit.reporterRelation = form.customRelation;
      }

      Object.entries(formToSubmit).forEach(([key, value]) => {
        if (key !== "customRelation") {
          payload.append(key, value);
        }
      });
      payload.set("description", voiceText || form.description);

      if (locationForSubmit) {
        payload.append(
          "lastSeenCoordinates",
          `${locationForSubmit.longitude}, ${locationForSubmit.latitude}`,
        );
      }

      if (photo) {
        payload.append("files", photo);
      }

      const response = await api.post("/cases/report", payload);
      const createdCase = response.data?.data;

      toast.success("Missing-person report submitted.");
      if (createdCase?.caseId) {
        navigate(`/cases/${createdCase.caseId}`);
      } else {
        navigate("/cases");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Unable to submit the report.",
      );
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "person", label: language === "am" ? "የጠፋው ሰው" : "Missing Person" },
    { id: "incident", label: language === "am" ? "ክስተት" : "Incident" },
    { id: "reporter", label: language === "am" ? "ሪፖርተር" : "Reporter" },
  ];

  useEffect(() => {
    const prefillData = sessionStorage.getItem("prefillReport");
    if (prefillData) {
      try {
        const parsed = JSON.parse(prefillData);
        setForm((current) => ({
          ...current,
          ...parsed,
        }));
        // Clear after using
        sessionStorage.removeItem("prefillReport");
        toast.success(
          language === "am"
            ? "📋 AI ያወጣቸው መረጃዎች ተሞልተዋል"
            : "📋 AI extracted details pre-filled",
        );
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Check if section is complete (for visual indicator)
  const isSectionComplete = (sectionId) => {
    if (sectionId === "person") {
      return form.missingPersonName.trim() && form.age;
    }
    if (sectionId === "incident") {
      return (
        form.lastSeenLocation.trim() &&
        form.lastSeenDate &&
        form.description.trim()
      );
    }
    if (sectionId === "reporter") {
      return (
        form.reporterName.trim() &&
        form.reporterPhone.trim() &&
        form.reporterRelation.trim()
      );
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span className="text-sm font-medium hidden sm:inline">
                {language === "am" ? "ተመለስ" : "Back"}
              </span>
            </button>

            <h1 className="text-lg font-bold text-stone-900">
              {language === "am" ? "የጠፋ ሰው ሪፖርት ያድርጉ" : "Report Missing Person"}
            </h1>

            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  language === "en"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("am")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  language === "am"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                አማ
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
              {language === "am" ? "አስቸኳይ ሪፖርት" : "Urgent Report"}
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            {language === "am"
              ? "እያንዳንዱ ዝርዝር መረጃ ወሳኝ ነው"
              : "Every detail matters in finding someone"}
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl">{helperText}</p>
        </div>

        {/* Section Navigation - No icons */}
        <div className="flex gap-2 mb-8 bg-stone-100 rounded-2xl p-1.5">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                activeSection === section.id
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <span>{section.label}</span>
              {isSectionComplete(section.id) && (
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Section 1: Missing Person Details */}
            {activeSection === "person" && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {language === "am"
                      ? "የጠፋው ሰው መረጃ"
                      : "Missing Person Details"}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {language === "am"
                      ? "ስለ ጠፋው ሰው መሰረታዊ መረጃ ያቅርቡ"
                      : "Provide basic information about the missing person"}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am" ? "ሙሉ ስም" : "Full Name"} *
                    </label>
                    <input
                      value={form.missingPersonName}
                      onChange={(e) => {
                        updateField("missingPersonName", e.target.value);
                        clearFieldError("missingPersonName");
                      }}
                      placeholder={
                        language === "am" ? "ሙሉ ስም ያስገቡ" : "Enter full name"
                      }
                      className={`w-full rounded-2xl border-2 px-4 py-3.5 text-sm focus:ring-4 outline-none transition-all ${
                        validationErrors.missingPersonName
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50"
                          : "border-stone-200 focus:border-terracotta focus:ring-terracotta/10"
                      }`}
                    />
                    {validationErrors.missingPersonName && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.missingPersonName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am" ? "ዕድሜ" : "Age"}
                    </label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => {
                        updateField("age", e.target.value);
                        clearFieldError("age");
                      }}
                      placeholder={
                        language === "am" ? "ግምታዊ ዕድሜ" : "Approximate age"
                      }
                      className={`w-full rounded-2xl border-2 px-4 py-3.5 text-sm focus:ring-4 outline-none transition-all ${
                        validationErrors.age
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50"
                          : "border-stone-200 focus:border-terracotta focus:ring-terracotta/10"
                      }`}
                    />
                    {validationErrors.age && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.age}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am" ? "ጾታ" : "Gender"}
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3.5 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all bg-white"
                    >
                      <option value="unknown">
                        {language === "am" ? "አይታወቅም" : "Unknown"}
                      </option>
                      <option value="male">
                        {language === "am" ? "ወንድ" : "Male"}
                      </option>
                      <option value="female">
                        {language === "am" ? "ሴት" : "Female"}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am" ? "አለባበስ" : "Clothing"}
                    </label>
                    <input
                      value={form.clothing}
                      onChange={(e) => updateField("clothing", e.target.value)}
                      placeholder={
                        language === "am"
                          ? "ለምሳሌ፡ ቀይ ሸሚዝ፣ ጂንስ"
                          : "e.g., Red shirt, blue jeans"
                      }
                      className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3.5 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    {language === "am" ? "የቅርብ ጊዜ ፎቶ" : "Recent Photo"}
                  </label>
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-2xl"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-8 cursor-pointer hover:border-terracotta/50 hover:bg-stone-100 transition-all">
                      <div className="w-12 h-12 bg-stone-200 rounded-xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-stone-500" />
                      </div>
                      <span className="text-sm text-stone-600">
                        {language === "am"
                          ? "ለመጫን ጠቅ ያድርጉ"
                          : "Click to upload photo"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Section 2: Incident Details */}
            {activeSection === "incident" && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {language === "am" ? "የክስተት ዝርዝሮች" : "Incident Details"}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {language === "am"
                      ? "የት እና መቼ ለመጨረሻ ጊዜ ታዩ?"
                      : "Where and when were they last seen?"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am"
                        ? "የመጨረሻው የታዩበት ቦታ"
                        : "Last Seen Location"}{" "}
                      *
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input
                          value={form.lastSeenLocation}
                          onChange={(e) => {
                            setResolvedLocation(null);
                            updateField("lastSeenLocation", e.target.value);
                            clearFieldError("lastSeenLocation");
                          }}
                          placeholder={
                            language === "am"
                              ? "አድራሻ ወይም ቦታ"
                              : "Address or landmark"
                          }
                          className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 text-sm focus:ring-4 outline-none transition-all ${
                            validationErrors.lastSeenLocation
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50"
                              : "border-stone-200 focus:border-terracotta focus:ring-terracotta/10"
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleResolveLocation}
                        disabled={resolvingLocation}
                        className="px-4 py-3.5 bg-stone-900 text-white rounded-2xl text-sm font-semibold hover:bg-stone-800 disabled:opacity-50 transition-all flex items-center gap-2 flex-shrink-0"
                      >
                        {resolvingLocation ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">
                          {resolvingLocation ? "Finding..." : "Find on map"}
                        </span>
                      </button>
                    </div>
                    {validationErrors.lastSeenLocation && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.lastSeenLocation}
                      </p>
                    )}
                    {resolvedLocation && (
                      <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {language === "am"
                          ? "ካርታ ላይ ተገኝቷል"
                          : "Location verified"}
                        : {resolvedLocation.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am" ? "ቀን እና ሰዓት" : "Date & Time"} *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="datetime-local"
                        value={form.lastSeenDate}
                        onChange={(e) => {
                          updateField("lastSeenDate", e.target.value);
                          clearFieldError("lastSeenDate");
                        }}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 text-sm focus:ring-4 outline-none transition-all ${
                          validationErrors.lastSeenDate
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50"
                            : "border-stone-200 focus:border-terracotta focus:ring-terracotta/10"
                        }`}
                      />
                    </div>
                    {validationErrors.lastSeenDate && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.lastSeenDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am" ? "መግለጫ" : "Description"} *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => {
                        updateField("description", e.target.value);
                        clearFieldError("description");
                      }}
                      rows={5}
                      placeholder={
                        language === "am"
                          ? "መልክን፣ ሁኔታን እና ማንኛውንም ጠቃሚ መረጃ ይግለጹ"
                          : "Describe appearance, circumstances, and any relevant details"
                      }
                      className={`w-full rounded-2xl border-2 px-4 py-3.5 text-sm focus:ring-4 outline-none transition-all resize-none ${
                        validationErrors.description
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50"
                          : "border-stone-200 focus:border-terracotta focus:ring-terracotta/10"
                      }`}
                    />
                    {validationErrors.description && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.description}
                      </p>
                    )}
                  </div>

                  {/* AI & Voice Tools */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleAiExtract}
                      disabled={extracting}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-clay-light text-white rounded-2xl text-sm font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all shadow-lg shadow-purple-200"
                    >
                      {extracting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {language === "am" ? "AI ማውጣት" : "AI Extract"}
                    </button>
                  </div>

                  {/* Voice Input */}
                  <div className="rounded-2xl border-2 border-stone-200 p-5 bg-stone-50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Mic className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-sm font-semibold text-stone-700">
                        {language === "am" ? "የድምጽ ሪፖርት" : "Voice Report"}
                      </span>
                    </div>
                    <VoiceInput
                      language={language === "am" ? "am-ET" : "en-US"}
                      onTranscript={(text) => {
                        setVoiceText(text);
                        if (!form.description.trim()) {
                          updateField("description", text);
                        }
                      }}
                    />
                  </div>

                  {/* AI Preview */}
                  {aiPreview && (
                    <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                      <p className="text-sm font-semibold text-purple-900 mb-3">
                        {language === "am" ? "AI ውጤት" : "AI Extraction Preview"}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-purple-600 font-medium">
                            Name:
                          </span>{" "}
                          {aiPreview.name || "N/A"}
                        </div>
                        <div>
                          <span className="text-purple-600 font-medium">
                            Age:
                          </span>{" "}
                          {aiPreview.age || "N/A"}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-purple-600 font-medium">
                            Location:
                          </span>{" "}
                          {aiPreview.lastSeenLocation || "N/A"}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-purple-600 font-medium">
                            Clothing:
                          </span>{" "}
                          {aiPreview.clothing?.length
                            ? aiPreview.clothing.join(", ")
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section 3: Reporter Details */}
            {activeSection === "reporter" && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {language === "am" ? "የሪፖርተር መረጃ" : "Reporter Information"}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {language === "am"
                      ? "እንዴት ልናገኝዎት እንችላለን?"
                      : "How can we contact you?"}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am" ? "ስምዎ" : "Your Name"} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        value={form.reporterName}
                        onChange={(e) => {
                          updateField("reporterName", e.target.value);
                          clearFieldError("reporterName");
                        }}
                        placeholder={
                          language === "am"
                            ? "ሙሉ ስምዎን ያስገቡ"
                            : "Enter your full name"
                        }
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 text-sm focus:ring-4 outline-none transition-all ${
                          validationErrors.reporterName
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50"
                            : "border-stone-200 focus:border-terracotta focus:ring-terracotta/10"
                        }`}
                        required
                      />
                    </div>
                    {validationErrors.reporterName && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.reporterName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am" ? "ስልክ ቁጥር" : "Phone Number"} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        value={form.reporterPhone}
                        onChange={(e) => {
                          updateField("reporterPhone", e.target.value);
                          clearFieldError("reporterPhone");
                        }}
                        placeholder="+251..."
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 text-sm focus:ring-4 outline-none transition-all ${
                          validationErrors.reporterPhone
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50"
                            : "border-stone-200 focus:border-terracotta focus:ring-terracotta/10"
                        }`}
                        required
                      />
                    </div>
                    {validationErrors.reporterPhone && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.reporterPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am" ? "የኤስኤምኤስ ስልክ" : "SMS Phone"}
                    </label>
                    <input
                      value={form.smsPhone}
                      onChange={(e) => updateField("smsPhone", e.target.value)}
                      placeholder={language === "am" ? "አማራጭ" : "Optional, e.g. 0911223344"}
                      className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3.5 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      {language === "am"
                        ? "ከጠፋው ሰው ጋር ያለዎት ግንኙነት"
                        : "Relationship to Missing Person"}{" "}
                      *
                    </label>
                    <select
                      value={form.reporterRelation}
                      onChange={(e) => {
                        updateField("reporterRelation", e.target.value);
                        clearFieldError("reporterRelation");
                      }}
                      className={`w-full rounded-2xl border-2 px-4 py-3.5 text-sm focus:ring-4 outline-none transition-all bg-white ${
                        validationErrors.reporterRelation
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50"
                          : "border-stone-200 focus:border-terracotta focus:ring-terracotta/10"
                      }`}
                      required
                    >
                      <option value="">
                        {language === "am" ? "ይምረጡ" : "Select relationship"}
                      </option>
                      {RELATIONSHIP_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.reporterRelation && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.reporterRelation}
                      </p>
                    )}

                    {/* Custom relationship input */}
                    {form.reporterRelation === "other" && (
                      <div className="mt-3">
                        <input
                          value={form.customRelation}
                          onChange={(e) =>
                            updateField("customRelation", e.target.value)
                          }
                          placeholder={
                            language === "am"
                              ? "ግንኙነትዎን ይግለጹ"
                              : "Please specify your relationship"
                          }
                          className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3.5 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => {
                  const currentIndex = sections.findIndex(
                    (s) => s.id === activeSection,
                  );
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`px-6 py-3 text-stone-600 font-semibold rounded-2xl hover:bg-stone-100 transition-all ${
                  activeSection === "person" ? "invisible" : ""
                }`}
              >
                ← {language === "am" ? "ቀዳሚ" : "Previous"}
              </button>

              {activeSection !== "reporter" ? (
                <button
                  type="button"
                  onClick={() => {
                    // Validate current section before proceeding
                    if (!validateSection(activeSection)) {
                      return; // Stop if validation fails
                    }

                    const currentIndex = sections.findIndex(
                      (s) => s.id === activeSection,
                    );
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1].id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="px-8 py-3.5 bg-stone-900 text-white font-semibold rounded-2xl hover:bg-stone-800 transition-all shadow-lg"
                >
                  {language === "am" ? "ቀጣይ" : "Next"} →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-xl shadow-red-200 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {language === "am" ? "በማስገባት ላይ..." : "Submitting..."}
                    </>
                  ) : (
                    <>{language === "am" ? "ሪፖርት አስገባ" : "Submit Report"}</>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Trust Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
            <p className="text-xs text-green-700 font-medium">
              {language === "am"
                ? "የእርስዎ መረጃ ደህንነቱ የተጠበቀ ነው"
                : "Your information is encrypted and secure"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCasePage;
