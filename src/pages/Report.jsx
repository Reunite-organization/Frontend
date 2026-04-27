import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  MapPin,
  Calendar,
  User,
  Phone,
  AlertCircle,
  AudioLines,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import speechService from "@/services/speechService";
import api, { aiService } from "@/services/api";
import { useI18n } from "@/contexts/I18nContext";

const Report = () => {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    missingPersonName: "",
    age: "",
    lastSeenLocation: "",
    lastSeenDate: "",
    description: "",
    reporterName: "",
    reporterPhone: "",
    reporterRelation: "",
    photos: [],
  });
  const [loading, setLoading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [detectedLang, setDetectedLang] = useState("en-US");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      photos: files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const timestamp = new Date(formData.lastSeenDate);
      if (!formData.missingPersonName.trim()) {
        toast.error("Missing person name is required.");
        setLoading(false);
        return;
      }

      if (!formData.lastSeenLocation.trim()) {
        toast.error("Please provide the last seen location.");
        setLoading(false);
        return;
      }

      if (!formData.lastSeenDate || Number.isNaN(timestamp.getTime())) {
        toast.error("Please provide a valid last seen date and time.");
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      const normalizedData = {
        ...formData,
        lastSeenDate: timestamp.toISOString(),
      };

      Object.keys(normalizedData).forEach((key) => {
        if (key === "photos") {
          normalizedData.photos.forEach((file, index) => {
            submitData.append(`photo_${index}`, file);
          });
        } else {
          submitData.append(key, normalizedData[key]);
        }
      });

      const response = await api.post("/cases/report", submitData);
      const data = response.data;

      if (data.success) {
        toast.success(
          "Report submitted successfully! Our team will review it immediately.",
        );
        navigate("/cases");
      } else {
        toast.error(data.error || "Failed to submit report");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // AI Voice Interaction Logic
  const startVoiceInterview = () => {
    if (!speechService.isSupported()) {
      toast.error("Voice interaction not supported in this browser");
      return;
    }
   console.log(import.meta.env);

    setIsListening(true);
    setAiStatus("Listening...");

    // Initial AI Prompt based on step
    const prompt =
      step === 1
        ? t("Please tell me the name and approximate age of the person.")
        : t("Please describe what happened and where they were last seen.");

    speechService.speak(prompt, detectedLang);

    speechService.startListening(
      async (transcript) => {
        setIsListening(false);
        setIsAiProcessing(true);
        setAiStatus("Analyzing details...");

        try {
          const lang = speechService.detectLanguage(transcript);
          setDetectedLang(lang);

          const extraction = await aiService.extractInfo({
            text: transcript,
            language: lang,
          });

          // Map extracted data to form
          setFormData((prev) => ({
            ...prev,
            missingPersonName: extraction.name || prev.missingPersonName,
            age: extraction.age || prev.age,
            lastSeenLocation:
              extraction.lastSeenLocation || prev.lastSeenLocation,
            description: prev.description
              ? `${prev.description}\n\nAI Notes: ${transcript}`
              : transcript,
          }));

          // Check for missing data and ask follow-up
          handleAiFollowUp(extraction, lang);
        } catch (error) {
          setAiStatus("");
          toast.error("AI processing failed. Please type manually.");
        } finally {
          setIsAiProcessing(false);
        }
      },
      (error) => {
        setIsListening(false);
        setAiStatus("");
      },
    );
  };

  const handleAiFollowUp = (data, lang) => {
    let followUp = "";

    if (!data.name && step === 1) {
      followUp = t("Could you please tell me the person's name?");
    } else if (!data.lastSeenLocation) {
      followUp = t("Where exactly were they last seen?");
    } else if (!data.clothing || data.clothing.length === 0) {
      followUp = t("What were they wearing at the time?");
    }

    if (followUp) {
      setAiStatus("Asking follow-up...");
      speechService.speak(followUp, lang, () => {
        // Automatically start listening for the answer
        setTimeout(startVoiceInterview, 500);
      });
    } else {
      setAiStatus(t("Details captured!"));
      speechService.speak(t("Details captured. Thank you."), lang);
      setTimeout(() => setAiStatus(""), 2000);
    }
  };

  const steps = [
    { id: 1, label: t("Identity"), icon: User },
    { id: 2, label: t("Incident"), icon: MapPin },
    { id: 3, label: t("Contact"), icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-bold text-slate-900">
              {t("Report Missing Person")}
            </h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100">
          <motion.div
            initial={{ width: "33.33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-emerald-600"
          />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator Desktop */}
        <div className="hidden sm:flex justify-between mb-12">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  step >= s.id
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {step > s.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <s.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  step >= s.id ? "text-emerald-700" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Alert */}
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      Missing Person Identity
                    </h2>
                    <p className="text-sm text-slate-500">
                      Let's start with basic identification
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          name="missingPersonName"
                          value={formData.missingPersonName}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
                          placeholder="Full Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Approximate Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
                        placeholder="Age"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Recent Photos
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                      <Upload className="h-10 w-10 text-slate-300 mx-auto mb-3 group-hover:text-emerald-500 transition-colors" />
                      <div className="text-sm text-slate-600">
                        <label
                          htmlFor="photo-upload"
                          className="cursor-pointer font-bold text-emerald-600 hover:underline"
                        >
                          Click to upload
                        </label>{" "}
                        or drag and drop
                        <input
                          id="photo-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                      {formData.photos.length > 0 && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                          {formData.photos.map((f, i) => (
                            <div
                              key={i}
                              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold"
                            >
                              {f.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      Incident Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Where and when were they last seen?
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Last Seen Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        name="lastSeenLocation"
                        value={formData.lastSeenLocation}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        placeholder="Specific building, street or area"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">
                        Description & Voice AI
                      </label>
                      <button
                        type="button"
                        onClick={startVoiceInterview}
                        className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                          isListening
                            ? "bg-red-100 text-red-600 animate-pulse"
                            : isAiProcessing
                              ? "bg-amber-100 text-amber-600"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        }`}
                      >
                        <AudioLines className="w-4 h-4" />
                        <span>{aiStatus || "Report by Voice"}</span>
                      </button>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500"
                      placeholder="Describe appearance, clothing, and details of how they went missing..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Date and Time
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="datetime-local"
                        name="lastSeenDate"
                        value={formData.lastSeenDate}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      Reporter Contact
                    </h2>
                    <p className="text-sm text-slate-500">
                      How can we reach you for updates?
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          name="reporterName"
                          value={formData.reporterName}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                          placeholder="Reporter Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="tel"
                          name="reporterPhone"
                          value={formData.reporterPhone}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                          placeholder="+251..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Relationship
                    </label>
                    <select
                      name="reporterRelation"
                      value={formData.reporterRelation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">Select Relationship</option>
                      <option value="parent">Parent / Guardian</option>
                      <option value="family">Other Family</option>
                      <option value="friend">Friend</option>
                      <option value="witness">Witness</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
              <button
                type="button"
                onClick={() => (step > 1 ? setStep(step - 1) : navigate("/"))}
                className="flex items-center px-6 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                {step === 1 ? "Cancel" : "Previous"}
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex items-center px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                >
                  Next Step
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-10 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:bg-slate-300 transition-all shadow-lg shadow-red-100"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    "Submit Emergency Report"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Trust Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Reunite AI encryption ensures your private reporter data is only
            shared with verified search coordinators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;
