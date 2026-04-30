import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  MapPin,
  Clock,
  Award,
  ToggleLeft,
  ToggleRight,
  Navigation,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import useVolunteerStore from "./volunteerStore";
import { caseService } from "@/services/caseService";
import { useLocation } from "@/hooks/useLocation";
import { useSocket } from "@/hooks/useSocket";

export default function VolunteerDashboard() {
  const [nearbyCases, setNearbyCases] = useState([]);
  const [activeSearch, setActiveSearch] = useState(null);
  const [loading, setLoading] = useState(false);

  const { location, getCurrentLocation } = useLocation();
  const { socket } = useSocket();

  const {
    isVolunteer,
    isAvailable,
    assignedCases,
    stats,
    setVolunteerStatus,
    setAvailability,
    assignCase,
    completeCase,
  } = useVolunteerStore();

  useEffect(() => {
    if (isAvailable && location) {
      loadNearbyCases();
    }
  }, [isAvailable, location]);

  useEffect(() => {
    if (socket) {
      socket.on("volunteer-request", handleVolunteerRequest);
      socket.on("search-update", handleSearchUpdate);

      return () => {
        socket.off("volunteer-request");
        socket.off("search-update");
      };
    }
  }, [socket]);

  const loadNearbyCases = async () => {
    if (!location) return;

    setLoading(true);
    try {
      const response = await caseService.getNearbyCases(
        location.latitude,
        location.longitude,
        10,
      );
      setNearbyCases(response.data);
    } catch (error) {
      console.error("Failed to load nearby cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteerRequest = (data) => {
    toast.message("Search Assistance Needed", {
      description: data.message,
      action: {
        label: "View",
        onClick: () => (window.location.href = `/case/${data.caseId}`),
      },
    });
  };

  const handleSearchUpdate = (data) => {
    if (activeSearch?.caseId === data.caseId) {
      setActiveSearch((prev) => ({
        ...prev,
        progress: data.progress,
      }));
    }
  };

  const toggleVolunteerMode = () => {
    if (!isVolunteer) {
      setVolunteerStatus(true);
      toast.success("You are now a volunteer!");
    }
    setAvailability(!isAvailable);

    if (!isAvailable) {
      getCurrentLocation();
      toast.success("You are now available for searches");
      socket?.emit("volunteer-status", { status: "available" });
    } else {
      toast.info("You are now offline");
      socket?.emit("volunteer-status", { status: "offline" });
    }
  };

  const acceptCase = async (caseData) => {
    try {
      assignCase(caseData.caseId);
      setActiveSearch({
        caseId: caseData.caseId,
        startTime: new Date(),
        progress: 0,
      });

      socket?.emit("join-case", caseData.caseId);

      toast.success(`Assigned to case: ${caseData.caseId}`);

      // Update backend
      await caseService.updateCase(caseData.caseId, {
        assignedVolunteers: [
          ...(caseData.assignedVolunteers || []),
          {
            deviceId: localStorage.getItem("deviceId"),
            assignedAt: new Date(),
          },
        ],
      });

      setNearbyCases((prev) =>
        prev.filter((c) => c.caseId !== caseData.caseId),
      );
    } catch (error) {
      toast.error("Failed to accept case");
    }
  };

  const completeSearch = async () => {
    if (!activeSearch) return;

    try {
      completeCase(activeSearch.caseId);

      const hoursSpent =
        (Date.now() - activeSearch.startTime) / (1000 * 60 * 60);
      useVolunteerStore.getState().addHours(hoursSpent);

      socket?.emit("search-progress", {
        caseId: activeSearch.caseId,
        progress: 100,
      });

      toast.success("Search completed! Thank you for volunteering!");
      setActiveSearch(null);
    } catch (error) {
      toast.error("Failed to complete search");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
          <p className="text-gray-600">
            Help reunite missing persons with their families
          </p>
        </div>

        <Button
          size="lg"
          variant={isAvailable ? "default" : "outline"}
          onClick={toggleVolunteerMode}
          className="gap-2"
        >
          {isAvailable ? (
            <>
              <ToggleRight className="w-5 h-5" />
              Available for Search
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5" />
              Start Volunteering
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.totalSearches}</div>
                <p className="text-sm text-gray-500">Total Searches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {stats.hoursVolunteered.toFixed(1)}
                </div>
                <p className="text-sm text-gray-500">Hours Volunteered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{stats.casesHelped}</div>
                <p className="text-sm text-gray-500">Cases Helped</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                {stats.trustScore || 0}
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.trustScore || 0}%
                </div>
                <p className="text-sm text-gray-500">Trust Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Search */}
      {activeSearch && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Active Search in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Case: {activeSearch.caseId}</span>
                <Badge>In Progress</Badge>
              </div>
              <Progress value={activeSearch.progress} className="h-2" />
              <Button onClick={completeSearch} className="w-full gap-2">
                <CheckCircle className="w-4 h-4" />
                Complete Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearby Cases */}
      {isAvailable && (
        <Card>
          <CardHeader>
            <CardTitle>Nearby Cases ({nearbyCases.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading nearby cases...
              </div>
            ) : nearbyCases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No active cases in your area
              </div>
            ) : (
              <div className="space-y-3">
                {nearbyCases.map((caseItem) => (
                  <div key={caseItem.caseId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {caseItem.person?.name || "Unknown"}
                          {caseItem.person?.age && ` (${caseItem.person.age})`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {caseItem.aiData?.summary || "No description"}
                        </p>
                      </div>
                      <Badge
                        className={
                          caseItem.priority?.level === "HIGH"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }
                      >
                        {caseItem.priority?.level}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {caseItem.lastSeen?.address || "Unknown"}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => acceptCase(caseItem)}
                      disabled={assignedCases.includes(caseItem.caseId)}
                    >
                      {assignedCases.includes(caseItem.caseId)
                        ? "Assigned"
                        : "Accept Case"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
