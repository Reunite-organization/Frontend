import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MapPin,
  Calendar,
  Users,
  Lock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCreatePost } from "../../hooks/usePosts";
import { useLanguage } from "../../../../lib/i18n";
import { MemoryInput } from "./MemoryInput";
import { LocationPicker } from "./LocationPicker";
import { QuestionBuilder } from "./QuestionBuilder";
import { CategorySelector } from "./CategorySelector";
import { GroupPostSettings } from "./GroupPostSettings";

const STEPS = [
  { id: "memory", label: { en: "Memory", am: "ትዝታ" } },
  { id: "details", label: { en: "Details", am: "ዝርዝሮች" } },
  { id: "review", label: { en: "Review", am: "ግምገማ" } },
];

export const CreatePostPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { mutate: createPost, isPending } = useCreatePost();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personDetails: {
      personName: "",
      nickname: "",
      knownAs: "",
    },
    memoryText: { en: "", am: "" },
    city: "",
    country: "",
    year: "",
    timeframe: "",
    category: "",
    isGroupPost: false,
    maxClaimants: 1,
    soughtPeople: [],
  });

  const [errors, setErrors] = useState({});

  const updateFormData = (updates) => {
    setFormData((prev) => {
      if (updates.personDetails) {
        return {
          ...prev,
          ...updates,
          personDetails: {
            ...prev.personDetails,
            ...updates.personDetails,
          },
        };
      }
      return { ...prev, ...updates };
    });
  };

  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 0:
        if (!formData.memoryText.en && !formData.memoryText.am) {
          newErrors.memoryText =
            language === "am"
              ? "ቢያንስ በአንድ ቋንቋ ትዝታ ያስፈልጋል"
              : "Memory text is required in at least one language";
        }
        if (!formData.personDetails?.personName) {
          newErrors.personName = "Full name is required";
        }

        if (!formData.personDetails?.knownAs) {
          newErrors.knownAs = "This field is required";
        }
        break;
      case 1: // Details
        if (!formData.city) newErrors.city = "Required";
        if (!formData.year) newErrors.year = "Required";
        if (!formData.category) newErrors.category = "Required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validateStep()) {
      const submissionData = {
        ...formData,
        year: formData.year ? parseInt(formData.year, 10) : undefined,
      };

      createPost(submissionData, {
        onSuccess: (post) => {
          navigate(`/wanted/post/${post._id}`);
        },
        onError: (error) => {
          console.log(error.response?.data);

          setErrors({
            api: error.response?.data?.message || "Something went wrong",
          });
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header with Progress */}
      <div className="sticky top-0 z-40 bg-warm-white/95 backdrop-blur-md border-b border-warm-gray/30">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-olive hover:text-terracotta transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="font-display text-xl font-semibold text-charcoal">
              {language === "am" ? "ልጥፍ ይፍጠሩ" : "Create a Post"}
            </h1>
            <div className="w-6" />
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      idx < currentStep
                        ? "bg-hope-green text-white"
                        : idx === currentStep
                          ? "bg-terracotta text-white"
                          : "bg-warm-gray/30 text-stone"
                    }`}
                  >
                    {idx < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="text-xs text-stone mt-1 hidden sm:block">
                    {language === "am" ? step.label.am : step.label.en}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-12 sm:w-24 h-0.5 mx-2 ${
                      idx < currentStep ? "bg-hope-green" : "bg-warm-gray/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 0: Memory */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 rounded-full mb-4">
                      <Heart className="w-4 h-4 text-terracotta" />
                      <span className="text-sm font-medium text-olive">
                        {language === "am" ? "ትዝታዎን ያካፍሉ" : "Share Your Memory"}
                      </span>
                    </div>

                    <h2 className="font-display text-3xl font-bold text-charcoal mb-3">
                      {language === "am"
                        ? "ስለነሱ ምን ያስታውሳሉ?"
                        : "What do you remember about them?"}
                    </h2>
                  </div>
                  <div className="font-bold text-2xl text-center">
                    {" "}
                    {language === "am"
                      ? "እባኮ ፍለጋዎትን ለማፋጠን ከዚህ በታች ያሉትን ጥያቄዎች በቻሉት መጠን ለመሙላት ይሞክሩ መረጃውን መበድም በሞሉ ቁጥር ፍለጋዎት የዛኑ ያህል ይፋጠናል!!!"
                      : "The more details you share, the easier it will be to find the right person."}
                  </div>
                  <MemoryInput
                    value={formData}
                    onChange={updateFormData}
                    error={errors.memoryText}
                  />
                </div>
              )}

              {/* Step 1: Details */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="font-display text-3xl font-bold text-charcoal mb-3">
                      {language === "am" ? "መቼ እና የት?" : "When and Where?"}
                    </h2>
                    <p className="text-stone">
                      {language === "am"
                        ? "እነዚህ ዝርዝሮች ፍለጋውን ለማጥበብ ይረዳሉ"
                        : "These details help narrow down the search"}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <LocationPicker
                      city={formData.city}
                      country={formData.country}
                      onChange={({ city, country }) =>
                        updateFormData({ city, country })
                      }
                      error={errors.city}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          <Calendar className="inline w-4 h-4 mr-1" />
                          {language === "am" ? "ዓመት" : "Year"}
                        </label>
                        <input
                          type="number"
                          value={formData.year}
                          onChange={(e) =>
                            updateFormData({ year: e.target.value })
                          }
                          placeholder={
                            language === "am" ? "ለምሳሌ 2010" : "e.g., 2010"
                          }
                          min="1950"
                          max={new Date().getFullYear()}
                          className={`w-full px-4 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                            errors.year ? "border-error" : "border-warm-gray"
                          }`}
                        />
                        {errors.year && (
                          <p className="text-sm text-error mt-1">
                            {errors.year}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          {language === "am"
                            ? "የጊዜ ክልል (አማራጭ)"
                            : "Timeframe (Optional)"}
                        </label>
                        <input
                          type="text"
                          value={formData.timeframe}
                          onChange={(e) =>
                            updateFormData({ timeframe: e.target.value })
                          }
                          placeholder={
                            language === "am"
                              ? 'ለምሳሌ "በ2000ዎቹ መጀመሪያ"'
                              : 'e.g., "Early 2000s"'
                          }
                          className="w-full px-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <CategorySelector
                      value={formData.category}
                      onChange={(category) => updateFormData({ category })}
                      error={errors.category}
                    />

                    <GroupPostSettings
                      isGroupPost={formData.isGroupPost}
                      maxClaimants={formData.maxClaimants}
                      soughtPeople={formData.soughtPeople}
                      onChange={(updates) => updateFormData(updates)}
                    />
                  </div>
                </div>
              )}
              {/* Step 2: Review */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-hope-green/10 rounded-full mb-4">
                      <Sparkles className="w-4 h-4 text-hope-green" />
                      <span className="text-sm font-medium text-olive">
                        {language === "am" ? "ልጥፍዎን ይገምግሙ" : "Review Your Post"}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl font-bold text-charcoal mb-3">
                      {language === "am"
                        ? "ለማተም ዝግጁ ነዎት?"
                        : "Ready to Publish?"}
                    </h2>
                  </div>

                  {/* Post Preview */}
                  <div className="bg-cream rounded-2xl p-6 border border-warm-gray/30">
                    <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
                      {language === "am" ? "ቅድመ እይታ" : "Preview"}
                    </h3>

                    <div className="space-y-4">
                      <div className="prose">
                        <p className="text-charcoal">
                          {formData.memoryText[language] ||
                            formData.memoryText.en ||
                            formData.memoryText.am}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-stone">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {formData.city}
                          {formData.country && `, ${formData.country}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formData.year}
                        </span>
                        {formData.isGroupPost && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {language === "am" ? "የቡድን ልጥፍ" : "Group Post"} (
                            {formData.maxClaimants})
                          </span>
                        )}
                        {errors.api && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                            {errors.api}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="p-4 bg-warmth/5 rounded-xl border border-warmth/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-warmth flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-stone">
                        <p className="font-medium text-charcoal mb-1">
                          {language === "am"
                            ? "ከማተምዎ በፊት"
                            : "Before you publish"}
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>
                            {language === "am"
                              ? "ልጥፍዎ በይፋ ይታያል እና ማንም ሊያገኘው ይችላል"
                              : "Your post will be publicly visible and searchable"}
                          </li>
                          <li>
                            {language === "am"
                              ? "ማንነትዎ በልጥፉ ላይ ይታያል"
                              : "Your profile name will be shown on the post"}
                          </li>
                          <li>
                            {language === "am"
                              ? "ልጥፍዎ ለ90 ቀናት ንቁ ሆኖ ይቆያል"
                              : "Your post will remain active for 90 days"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-6 border-t border-warm-gray/30">
            <button
              onClick={handleBack}
              className={`px-6 py-3 text-olive hover:text-terracotta transition-colors ${
                currentStep === 0 ? "invisible" : ""
              }`}
            >
              <ChevronLeft className="inline w-5 h-5 mr-1" />
              {language === "am" ? "ወደ ኋላ" : "Back"}
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button onClick={handleNext} className="btn-primary">
                {language === "am" ? "ቀጥል" : "Continue"}
                <ChevronRight className="inline w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="btn-primary"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {language === "am" ? "በማተም ላይ..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="inline w-5 h-5 mr-2" />
                    {language === "am" ? "አትም" : "Publish Post"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
