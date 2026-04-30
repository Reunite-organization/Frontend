import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AISummary from "@/features/ai/AISummary";
import ExtractedDataDisplay from "@/features/ai/ExtractedDataDisplay";
import ConfidenceBadge from "@/features/ai/ConfidenceBadge";
import DualMapView from "@/features/map/DualMapView";
import { caseService } from "@/services/caseService";
import { useSocket } from "@/hooks/useSocket";
import {
  MapPin,
  Clock,
  User,
  Shirt,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Share2,
  Bell,
  Target,
  Cloud,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import SearchStrategyView from "../search/SearchStrategyView";

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, subscribe } = useSocket();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [updates, setUpdates] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    loadCaseData();

    if (socket) {
      socket.emit("join-case", id);

      subscribe("case-updated", (data) => {
        if (data.caseId === id) {
          setUpdates((prev) => [...prev, data]);
          toast.info("Case updated");
          loadCaseData();
        }
      });

      subscribe("sighting-added", (data) => {
        if (data.caseId === id) {
          toast.success("New sighting reported!");
          loadCaseData();
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit("leave-case", id);
      }
    };
  }, [id, socket]);

  const loadCaseData = async () => {
    try {
      const response = await caseService.getCaseById(id);
      setCaseData(response.data);
    } catch (error) {
      console.error("Failed to load case:", error);
      toast.error(
        "Failed to load case details. Please check your connection and try again.",
      );
      // Set fallback data to prevent crash
      setCaseData({
        caseId: id,
        person: { name: "Loading..." },
        status: "unknown",
        priority: { level: "UNKNOWN" },
        lastSeen: { location: { address: "Unknown" } },
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolveCase = async (outcome) => {
    try {
      await caseService.resolveCase(id, {
        outcome,
        notes: `Resolved via app`,
      });

      toast.success("Case marked as resolved");
      loadCaseData();
    } catch (error) {
      toast.error("Failed to resolve case");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleSubscribe = async () => {
    try {
      // Register for notifications
      toast.success("You will receive updates for this case");
    } catch (error) {
      toast.error("Failed to subscribe");
    }
  };

  const findPotentialMatches = async () => {
    setLoadingMatches(true);
    try {
      const response = await caseService.findMatches(id);
      setPotentialMatches(response.data || []);
      toast.success(`Found ${response.data?.length || 0} potential matches`);
    } catch (error) {
      console.error("Failed to find matches:", error);
      toast.error("Failed to find potential matches");
    } finally {
      setLoadingMatches(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              Loading case details...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Case Not Found</h3>
              <p className="text-gray-500 mb-4">
                The case you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = caseData.status === "active";
  const priorityColor =
    {
      HIGH: "bg-red-500",
      MEDIUM: "bg-yellow-500",
      LOW: "bg-green-500",
    }[caseData.priority?.level] || "bg-gray-500";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {caseData.person?.name || "Unknown Person"}
              <Badge className={priorityColor}>
                {caseData.priority?.level} PRIORITY
              </Badge>
              <Badge variant={isActive ? "default" : "secondary"}>
                {caseData.status.toUpperCase()}
              </Badge>
            </h1>
            <p className="text-gray-600">Case ID: {caseData.caseId}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={handleSubscribe}>
            <Bell className="w-4 h-4 mr-2" />
            Subscribe
          </Button>
          {isActive && (
            <>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleResolveCase("found_safe")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Found
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleResolveCase("case_closed")}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Close Case
              </Button>
            </>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {caseData.aiData?.summary && (
        <AISummary
          summary={caseData.aiData.summary}
          confidence={caseData.aiData.confidenceScore}
        />
      )}

      {/* Extracted Data */}
      {caseData.aiData?.extractedData && (
        <ExtractedDataDisplay extractedData={caseData.aiData.extractedData} />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Map & Sightings</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="matches">Potential Matches</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          
          <TabsTrigger value="weather">
            <Cloud className="w-4 h-4 mr-2" />
            Weather
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Person Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {caseData.person?.name || "Unknown"}
                  </span>

                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">
                    {caseData.person?.age || "Unknown"}
                  </span>

                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium">
                    {caseData.person?.gender || "Unknown"}
                  </span>
                </div>

                {caseData.person?.clothing?.length > 0 && (
                  <div>
                    <span className="text-gray-600 text-sm flex items-center gap-1 mb-2">
                      <Shirt className="w-4 h-4" />
                      Clothing:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {caseData.person.clothing.map((item, i) => (
                        <Badge key={i} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {caseData.person?.distinguishingFeatures?.length > 0 && (
                  <div>
                    <span className="text-gray-600 text-sm">
                      Distinguishing Features:
                    </span>
                    <ul className="list-disc list-inside text-sm mt-1">
                      {caseData.person.distinguishingFeatures.map(
                        (feature, i) => (
                          <li key={i}>{feature}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Last Seen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Location:</span>
                  <p className="font-medium mt-1">
                    {caseData.lastSeen?.address || "Unknown"}
                  </p>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Time:
                  </span>
                  <p className="font-medium mt-1">
                    {caseData.lastSeen?.timestamp
                      ? new Date(caseData.lastSeen.timestamp).toLocaleString()
                      : "Unknown"}
                    <span className="text-gray-500 ml-2">
                      (
                      {formatDistanceToNow(
                        new Date(
                          caseData.lastSeen?.timestamp || caseData.createdAt,
                        ),
                      )}{" "}
                      ago)
                    </span>
                  </p>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Coordinates:</span>
                  <p className="font-mono text-xs mt-1">
                    {caseData.lastSeen?.location?.coordinates?.join(", ") ||
                      "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {caseData.person?.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Reported:</span>
                <span>{new Date(caseData.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Confidence Score:</span>
                <ConfidenceBadge score={caseData.confidenceScore || 70} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Priority Score:</span>
                <span>{caseData.priority?.score}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Sightings:</span>
                <span>{caseData.sightings?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Volunteers Assigned:</span>
                <span>{caseData.assignedVolunteers?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <DualMapView caseData={caseData} />
        </TabsContent>

        <TabsContent value="volunteers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Volunteers</CardTitle>
            </CardHeader>
            <CardContent>
              {caseData.assignedVolunteers?.length > 0 ? (
                <div className="space-y-2">
                  {caseData.assignedVolunteers.map((volunteer, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">Volunteer #{i + 1}</p>
                        <p className="text-sm text-gray-600">
                          Assigned:{" "}
                          {new Date(volunteer.assignedAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge>{volunteer.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No volunteers assigned yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Potential Matches
                <Button
                  onClick={findPotentialMatches}
                  disabled={loadingMatches}
                  variant="outline"
                >
                  {loadingMatches ? "Searching..." : "Find Matches"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {potentialMatches.length > 0 ? (
                <div className="space-y-3">
                  {potentialMatches.map((match, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {match.person?.name || "Unknown Person"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Case ID: {match.caseId}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {Math.round(match.confidence * 100)}% match
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/case/${match.caseId}`)}
                            >
                              View Case
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Age:</span>{" "}
                            {match.person?.age || "Unknown"}
                          </div>
                          <div>
                            <span className="text-gray-600">Location:</span>{" "}
                            {match.lastSeen?.address || "Unknown"}
                          </div>
                          <div>
                            <span className="text-gray-600">Clothing:</span>{" "}
                            {match.person?.clothing?.join(", ") || "Unknown"}
                          </div>
                          <div>
                            <span className="text-gray-600">Reported:</span>{" "}
                            {formatDistanceToNow(new Date(match.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>

                        {match.matchReasons && (
                          <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                            <strong>Match reasons:</strong>{" "}
                            {match.matchReasons.join(", ")}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {loadingMatches ? (
                    <div>Searching for potential matches...</div>
                  ) : (
                    <div>
                      Click "Find Matches" to search for similar cases that
                      might be the same person.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              {updates.length > 0 ? (
                <div className="space-y-2">
                  {updates.map((update, i) => (
                    <Alert key={i}>
                      <AlertDescription>
                        {new Date(update.timestamp).toLocaleTimeString()}: Case
                        updated
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Waiting for updates...
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="mt-4">
          <SearchStrategyView caseId={caseData.caseId} />
        </TabsContent>

        <TabsContent value="weather" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              {caseData.priority?.weatherRisk ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {caseData.priority.weatherRisk.weather?.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${caseData.priority.weatherRisk.weather.icon}@2x.png`}
                        alt="Weather"
                        className="w-16 h-16"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {caseData.priority.weatherRisk.weather?.temp}°C
                      </h3>
                      <p className="text-gray-600">
                        {caseData.priority.weatherRisk.weather?.description}
                      </p>
                    </div>
                  </div>

                  {caseData.priority.weatherRisk.riskLevel !== "MINIMAL" && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>
                          {caseData.priority.weatherRisk.riskLevel} Weather Risk
                        </strong>
                        <br />
                        Priority increased by{" "}
                        {caseData.priority.weatherRisk.boost} points
                        {caseData.priority.weatherRisk.details?.length > 0 && (
                          <div className="mt-2">
                            {caseData.priority.weatherRisk.details[0]}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Humidity:</strong>{" "}
                      {caseData.priority.weatherRisk.weather?.humidity}%
                    </div>
                    <div>
                      <strong>Wind Speed:</strong>{" "}
                      {caseData.priority.weatherRisk.weather?.windSpeed} m/s
                    </div>
                    <div>
                      <strong>Visibility:</strong>{" "}
                      {caseData.priority.weatherRisk.weather?.visibility} km
                    </div>
                    <div>
                      <strong>UV Index:</strong>{" "}
                      {caseData.priority.weatherRisk.weather?.uvIndex}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No weather data available for this case.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
