import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  Camera,
  Loader2,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Shield,
  Send,
  User,
  Calendar,
  Navigation,
} from "lucide-react";
import VoiceInput from "./VoiceInput";
import ScreenshotUpload from "./ScreenshotUpload";
import { useOffline } from "@/hooks/useOffline";
import { useLocation } from "@/hooks/useLocation";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";
import { caseService } from "@/services/caseService";
import { aiService } from "@/services/api";

export default function ReportForm() {
  const navigate = useNavigate();
  const { isOffline, saveOfflineReport, pendingSyncs } = useOffline();
  const {
    location,
    loading: locationLoading,
    getCurrentLocation,
  } = useLocation();
  const { t } = useI18n();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [voiceText, setVoiceText] = useState("");

  const [smsPhone, setSmsPhone] = useState("");
  const [enableSMS, setEnableSMS] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    name: "",
    age: "",
    lastSeenLocation: "",  
    image: null,
  });

  const [aiExtracted, setAiExtracted] = useState(null);

  const handleAIAssist = async () => {
    const contentToProcess = voiceText || formData.description;

    if (!contentToProcess && !formData.image) {
      toast.error("Please provide text, voice, or image input");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("AI is analyzing...");

    try {
      const response = await aiService.extractInfo({
        text: formData.description,
        imageBase64: formData.image,
        voiceText: voiceText,
      });

      if (!response.success) {
        throw new Error(response.error || "Extraction failed");
      }

      const extracted = response.data;
      setAiExtracted(extracted);

      setFormData((prev) => ({
        ...prev,
        name: extracted.name || prev.name,
        age: extracted.age?.toString() || prev.age,
        lastSeenLocation: extracted.lastSeenLocation || prev.lastSeenLocation,
        description: prev.description || extracted.description || "",
      }));

      toast.dismiss(loadingToast);

      const extractedItems = [];
      if (extracted.name) extractedItems.push(extracted.name);
      if (extracted.age) extractedItems.push(`${extracted.age} years`);
      if (extracted.clothing?.length)
        extractedItems.push(extracted.clothing[0]);

      toast.success(
        extractedItems.length > 0
          ? `Extracted: ${extractedItems.join(" • ")}`
          : "AI extraction complete!",
        { duration: 4000 },
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("AI extraction error:", error);

      if (!error.response) {
        toast.error("Cannot connect to server. Is the backend running?");
      } else {
        toast.error("AI extraction failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const caseData = {
        person: {
          name: formData.name || aiExtracted?.name || "Unknown",
          age: parseInt(formData.age) || aiExtracted?.age || null,
          gender: aiExtracted?.gender || "unknown",
          clothing: aiExtracted?.clothing || [],
          description: formData.description || aiExtracted?.description || "",
          distinguishingFeatures: aiExtracted?.distinguishingFeatures || [],
          imageUrl: formData.image || null,
          possibleDestinations: aiExtracted?.possibleDestinations || [],
        },
        lastSeen: location
          ? {
              location: {
                type: "Point",
                coordinates: [location.longitude, location.latitude],
                address: location.address || formData.lastSeenLocation,
              },
              timestamp: new Date().toISOString(),
            }
          : {
              location: {
                type: "Point",
                coordinates: [38.7469, 9.032],
                address: formData.lastSeenLocation || "Unknown",
              },
              timestamp: new Date().toISOString(),
            },
        aiData: aiExtracted
          ? {
              summary: aiExtracted.description || null,
              confidenceScore:
                aiExtracted.extractionMetadata?.confidenceScore || 70,
              confidenceLevel:
                aiExtracted.extractionMetadata?.confidenceLevel || "MEDIUM",
              extractionService: aiExtracted.extractionMetadata?.service,
              extractedData: aiExtracted, // Store raw extracted data
              priorityFactors: aiExtracted.urgencyIndicators || [],
            }
          : {
              confidenceScore: 50,
              confidenceLevel: "LOW",
            },
        priority: aiExtracted?.extractionMetadata
          ? {
              level: aiExtracted.extractionMetadata.priorityLevel || "MEDIUM",
              score: aiExtracted.extractionMetadata.priorityScore || 50,
              factors: aiExtracted.urgencyIndicators || [],
            }
          : {
              level: "MEDIUM",
              score: 50,
              factors: [],
            },
        aiExtracted: aiExtracted,
        smsPhone: enableSMS ? `09${smsPhone.replace(/\D/g, "")}` : null,
      };

      if (isOffline) {
        await saveOfflineReport(caseData);
        toast.success(`Report saved offline. Will sync when online.`);
        resetForm();
      } else {
        const response = await caseService.createCase(caseData);
        toast.success(`Case created!`, {
          description: `Case ID: ${response.data.caseId}`,
          action: {
            label: "View",
            onClick: () => navigate(`/case/${response.data.caseId}`),
          },
        });
        resetForm();
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      name: "",
      age: "",
      lastSeenLocation: "",
      image: null,
    });
    setVoiceText("");
    setAiExtracted(null);
    setActiveTab("text");
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getPriorityColor = (level) => {
    switch (level) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <Card className="shadow-lg border-0 sm:border">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
              {t("reportTitle")}
            </CardTitle>
            {aiExtracted?.extractionMetadata?.priorityLevel && (
              <Badge
                className={`${getPriorityColor(aiExtracted.extractionMetadata.priorityLevel)} text-white text-sm px-3 py-1 w-fit`}
              >
                {aiExtracted.extractionMetadata.priorityLevel} PRIORITY
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger
                value="text"
                className="text-xs sm:text-sm gap-1 sm:gap-2"
              >
                <span className="sm:inline">📝</span> Text
              </TabsTrigger>
              <TabsTrigger
                value="voice"
                className="text-xs sm:text-sm gap-1 sm:gap-2"
              >
                <Mic className="w-3 h-3 sm:w-4 sm:h-4" /> Voice
              </TabsTrigger>
              <TabsTrigger
                value="screenshot"
                className="text-xs sm:text-sm gap-1 sm:gap-2"
              >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" /> Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-4">
              <Textarea
                placeholder="Describe the missing person... (e.g., '8-year-old boy, red hoodie, last seen near Bole')"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={10}
                className="text-sm p-4 sm:text-base"
              />
            </TabsContent>

            <TabsContent value="voice" className="mt-4">
              <VoiceInput
                onTranscript={(text) => {
                  setVoiceText(text);
                  setFormData({ ...formData, description: text });
                }}
              />
            </TabsContent>

            <TabsContent value="screenshot" className="mt-4">
              <ScreenshotUpload
                onImage={(base64) =>
                  setFormData({ ...formData, image: base64 })
                }
              />
            </TabsContent>
          </Tabs>

          {/* Action Buttons - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleAIAssist}
              disabled={loading}
              className="h-12 sm:h-11 text-sm sm:text-base"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI Extract
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="h-12 sm:h-11 text-sm sm:text-base"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {locationLoading
                ? "Getting Location..."
                : location
                  ? "✓ Location Ready"
                  : "Get Location"}
            </Button>
          </div>

          {/* Location Status */}
          {location && (
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">
                  Location captured
                </span>
              </div>
              <p className="text-green-700 mt-1 text-xs sm:text-sm break-all">
                {location.address ||
                  `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
              </p>
            </div>
          )}

          {/* AI Extracted Preview */}
          {aiExtracted && (
            <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 space-y-3 sm:space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900 text-sm sm:text-base lg:text-lg">
                    AI Analysis Complete
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {aiExtracted.extractionMetadata?.confidenceScore && (
                    <Badge
                      className={`${getConfidenceColor(aiExtracted.extractionMetadata.confidenceScore)} text-white text-xs`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {aiExtracted.extractionMetadata.confidenceScore}%
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {aiExtracted.extractionMetadata?.service || "AI"}
                  </Badge>
                </div>
              </div>
              {/* Confidence Bar */}
              {aiExtracted.extractionMetadata?.confidenceScore && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Extraction Quality</span>
                    <span className="font-medium">
                      {aiExtracted.extractionMetadata.confidenceLevel}
                    </span>
                  </div>
                  <Progress
                    value={aiExtracted.extractionMetadata.confidenceScore}
                    className="h-2"
                  />
                </div>
              )}
              {/* Extracted Data - Responsive Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-gray-600 text-xs">Name</dt>
                    <dd className="text-gray-900 font-medium truncate">
                      {aiExtracted.name || (
                        <span className="text-gray-400 italic font-normal">
                          —
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-gray-600 text-xs">Age</dt>
                    <dd className="text-gray-900 font-medium">
                      {aiExtracted.age ? (
                        `${aiExtracted.age} years`
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-2 xs:col-span-2">
                  <Navigation className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-gray-600 text-xs">Last Seen</dt>
                    <dd className="text-gray-900 font-medium truncate">
                      {aiExtracted.lastSeenLocation || (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </dd>
                  </div>
                </div>
                <div className="space-y-3 border-t pt-4 mt-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enableSMS"
                      checked={enableSMS}
                      onChange={(e) => setEnableSMS(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label
                      htmlFor="enableSMS"
                      className="text-sm font-medium text-gray-700"
                    >
                      📱 Get SMS updates (works without internet)
                    </label>
                  </div>

                  {enableSMS && (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        +251
                      </span>
                      <Input
                        placeholder="9xxxxxxxx"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        className="pl-16"
                        maxLength={10}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter 09xxxxxxxx (Ethio Telecom and safaricom)
                      </p>
                    </div>
                  )}
                </div>

                {/* <div className="space-y-3 border-t pt-4">
                            <div className="flex items-center gap-2">
                                <input
                                type="checkbox"
                                id="enableWhatsApp"
                                checked={enableWhatsApp}
                                onChange={(e) => setEnableWhatsApp(e.target.checked)}
                                />
                                <label className="text-sm font-medium">
                                📱 Get WhatsApp updates (recommended)
                                </label>
                            </div>
                            
                            {enableWhatsApp && (
                                <Input
                                placeholder="09xxxxxxxx (WhatsApp number)"
                                value={whatsappPhone}
                                onChange={(e) => setWhatsappPhone(e.target.value)}
                                />
                            )}
                            </div> */}
              </div>
              {/* Clothing Tags */}
              {aiExtracted.clothing && aiExtracted.clothing.length > 0 && (
                <div>
                  <dt className="text-gray-600 text-xs mb-1.5">👕 Clothing</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {aiExtracted.clothing.map((item, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs capitalize"
                      >
                        {item}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
              {/* Urgency Indicators */}
              {aiExtracted.urgencyIndicators &&
                aiExtracted.urgencyIndicators.length > 0 && (
                  <div>
                    <dt className="text-gray-600 text-xs mb-1.5">⚠️ Urgency</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {aiExtracted.urgencyIndicators.map((indicator, i) => (
                        <Badge
                          key={i}
                          variant="destructive"
                          className="text-xs capitalize"
                        >
                          {indicator}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
              {/* Missing Fields Warning */}
              {(!aiExtracted.name ||
                !aiExtracted.age ||
                !aiExtracted.lastSeenLocation) && (
                <div className="flex items-start gap-2 p-2.5 bg-yellow-50 rounded-md border border-yellow-200">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-yellow-800">
                    Some information couldn't be extracted. Please fill in
                    missing fields below.
                  </span>
                </div>
              )}
              // Add this after the AI extraction preview section
              {aiExtracted?.weatherRisk &&
                aiExtracted.weatherRisk.riskLevel !== "MINIMAL" && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {aiExtracted.weatherRisk.weather?.icon?.includes("d")
                          ? "☀️"
                          : "🌙"}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">
                          {aiExtracted.weatherRisk.weather?.temp}°C,{" "}
                          {aiExtracted.weatherRisk.weather?.description}
                        </p>
                        <p className="text-sm text-orange-700 font-medium">
                          ⚠️ {aiExtracted.weatherRisk.riskLevel} WEATHER RISK (+
                          {aiExtracted.weatherRisk.boost} priority)
                        </p>
                      </div>
                    </div>
                    {aiExtracted.weatherRisk.details?.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        {aiExtracted.weatherRisk.details[0]}
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}

          {/* Manual Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t("personName")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t("personAge")}
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t("lastSeenLocation")}
                  value={formData.lastSeenLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastSeenLocation: e.target.value,
                    })
                  }
                  className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              {t("submitReport")}
            </Button>
          </form>

          {/* Offline Indicator */}
          {isOffline && (
            <div className="flex items-center justify-center gap-2 p-2 bg-yellow-50 rounded-md">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-yellow-700">
                You're offline • Report will sync when online
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
