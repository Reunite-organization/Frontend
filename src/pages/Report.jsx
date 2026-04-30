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
  Shield,
  Clock,
  Users,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import speechService from "@/services/speechService";
import api, { aiService } from "@/services/api";


const Report = () => {
//   const { t } = useI18n();
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
  const [previewUrls, setPreviewUrls] = useState([]);

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
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });
    
    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
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
      followUp = "Could you please tell me the person's name?";
    } else if (!data.lastSeenLocation) {
      followUp = "Where exactly were they last seen?"
    } else if (!data.clothing || data.clothing.length === 0) {
      followUp = "What were they wearing at the time?";
    }

    if (followUp) {
      setAiStatus("Asking follow-up...");
      speechService.speak(followUp, lang, () => {
        setTimeout(startVoiceInterview, 500);
      });
    } else {
      setAiStatus(t("Details captured!"));
      speechService.speak("Details captured. Thank you.");
      setTimeout(() => setAiStatus(""), 2000);
    }
  };

  const steps = [
    { id: 1, label: "Identity", description: "Who is missing?", icon: User },
    { id: 2, label: "Incident", description: "What happened?", icon: MapPin },
    { id: 3, label: "Contact", description: "How to reach you?", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-lg font-bold text-stone-900">
              Report Missing Person
            </h1>
            <div className="w-20" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-stone-100">
          <motion.div
            initial={{ width: "33.33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="h-full bg-gradient-to-r from-terracotta to-amber-500"
          />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Step Indicator */}
        <div className="mb-12">
          {/* Mobile Step Indicator */}
          <div className="sm:hidden flex items-center justify-between mb-8">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === s.id
                      ? "bg-terracotta text-white shadow-lg shadow-terracotta/25"
                      : step > s.id
                      ? "bg-emerald-500 text-white"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {step > s.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    s.id
                  )}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    step >= s.id ? "text-stone-900" : "text-stone-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop Step Indicator */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between relative">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`relative w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
                        step === s.id
                          ? "bg-terracotta text-white shadow-xl shadow-terracotta/25 scale-110"
                          : step > s.id
                          ? "bg-emerald-500 text-white"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {step > s.id ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <s.icon className="w-6 h-6" />
                      )}
                      {step === s.id && (
                        <motion.div
                          layoutId="activeStep"
                          className="absolute inset-0 rounded-2xl ring-4 ring-terracotta/20"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold mb-1 ${
                        step >= s.id ? "text-stone-900" : "text-stone-400"
                      }`}
                    >
                      {s.label}
                    </span>
                    <span className="text-xs text-stone-500">
                      {s.description}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-4 mt-[-2rem]">
                      <div
                        className={`h-full transition-all duration-500 ${
                          step > s.id ? "bg-emerald-500" : "bg-stone-200"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Time is critical
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Every detail you provide helps locate the missing person faster. Please be as accurate as possible.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900">
                      Missing Person Identity
                    </h2>
                    <p className="text-stone-500 mt-1">
                      Provide basic information about the missing person
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-stone-700 flex items-center gap-1">
                        Full Name
                        <span className="text-terracotta">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <input
                          type="text"
                          name="missingPersonName"
                          value={formData.missingPersonName}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-stone-700">
                        Approximate Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                        placeholder="Age"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-stone-700">
                      Recent Photos
                    </label>
                    <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center hover:border-terracotta/50 hover:bg-stone-50 transition-all cursor-pointer">
                      <input
                        id="photo-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Upload className="h-8 w-8 text-stone-400" />
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-terracotta hover:underline">
                            Click to upload
                          </span>
                          <span className="text-stone-500"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-2">
                          PNG, JPG up to 10MB each
                        </p>
                      </label>
                      {previewUrls.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {previewUrls.map((url, i) => (
                            <div key={i} className="relative group">
                              <img
                                src={url}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-24 object-cover rounded-xl"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(i)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900">
                      Incident Details
                    </h2>
                    <p className="text-stone-500 mt-1">
                      Provide details about when and where they were last seen
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-stone-700 flex items-center gap-1">
                      Last Seen Location
                      <span className="text-terracotta">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <input
                        type="text"
                        name="lastSeenLocation"
                        value={formData.lastSeenLocation}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                        placeholder="Specific building, street, or area"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-stone-700">
                        Description & Voice Input
                      </label>
                      <button
                        type="button"
                        onClick={startVoiceInterview}
                        disabled={isListening || isAiProcessing}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isListening
                            ? "bg-red-100 text-red-600 animate-pulse"
                            : isAiProcessing
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gradient-to-r from-terracotta to-amber-500 text-white hover:shadow-lg hover:shadow-terracotta/25"
                        }`}
                      >
                        <AudioLines className="w-4 h-4" />
                        {aiStatus || "Voice Report"}
                      </button>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all outline-none text-stone-900 placeholder:text-stone-400 resize-none"
                      placeholder="Describe appearance, clothing, circumstances, and any other relevant details..."
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-stone-700 flex items-center gap-1">
                      Date and Time
                      <span className="text-terracotta">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <input
                        type="datetime-local"
                        name="lastSeenDate"
                        value={formData.lastSeenDate}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all outline-none text-stone-900"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900">
                      Your Contact Information
                    </h2>
                    <p className="text-stone-500 mt-1">
                      How can our team reach you for updates?
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-stone-700 flex items-center gap-1">
                        Your Full Name
                        <span className="text-terracotta">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <input
                          type="text"
                          name="reporterName"
                          value={formData.reporterName}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                          placeholder="Your name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-stone-700 flex items-center gap-1">
                        Phone Number
                        <span className="text-terracotta">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <input
                          type="tel"
                          name="reporterPhone"
                          value={formData.reporterPhone}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                          placeholder="+251..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-stone-700 flex items-center gap-1">
                      Relationship to Missing Person
                      <span className="text-terracotta">*</span>
                    </label>
                    <select
                      name="reporterRelation"
                      value={formData.reporterRelation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all outline-none text-stone-900"
                      required
                    >
                      <option value="">Select relationship</option>
                      <option value="parent">Parent / Guardian</option>
                      <option value="spouse">Spouse</option>
                      <option value="sibling">Sibling</option>
                      <option value="child">Child</option>
                      <option value="family">Other Family Member</option>
                      <option value="friend">Friend</option>
                      <option value="colleague">Colleague</option>
                      <option value="neighbor">Neighbor</option>
                      <option value="witness">Witness</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-10 mt-8 border-t-2 border-stone-100">
              <button
                type="button"
                onClick={() => (step > 1 ? setStep(step - 1) : navigate("/"))}
                className="group flex items-center gap-2 px-6 py-3 text-stone-600 font-semibold rounded-2xl hover:bg-stone-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                {step === 1 ? "Cancel" : "Previous"}
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="group flex items-center gap-2 px-8 py-3.5 bg-stone-900 text-white font-semibold rounded-2xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-terracotta to-red-600 text-white font-semibold rounded-2xl hover:from-terracotta hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-terracotta/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Submit Report
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Trust & Security Footer */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-stone-600">
              <span className="font-semibold text-stone-900">Encrypted & Secure</span>
              <br />
              Your data is protected with end-to-end encryption
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200">
            <Clock className="w-5 h-5 text-terracotta flex-shrink-0" />
            <p className="text-xs text-stone-600">
              <span className="font-semibold text-stone-900">Immediate Response</span>
              <br />
              Reports are reviewed within minutes, 24/7
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200">
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-stone-600">
              <span className="font-semibold text-stone-900">Verified Network</span>
              <br />
              Only authorized search coordinators can access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
