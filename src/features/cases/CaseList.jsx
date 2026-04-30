import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { caseService } from "@/services/caseService";
import { MapPin, Clock, Search, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadCases();
    loadStats();
  }, []);

  const loadCases = async () => {
    try {
      const response = await caseService.getAllCases({
        status: "active",
        limit: 20,
      });
      setCases(response.data);
    } catch (error) {
      console.error("Failed to load cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await caseService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCases();
      return;
    }

    setLoading(true);
    try {
      const response = await caseService.searchCases(searchQuery);
      setCases(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.data.total}</div>
              <p className="text-sm text-gray-500">Total Cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {stats.data.byStatus.find((s) => s._id === "active")
                  ?.highPriority || 0}
              </div>
              <p className="text-sm text-gray-500">High Priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {stats.data.today}
              </div>
              <p className="text-sm text-gray-500">Today's Reports</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          placeholder="Search by name, location, or case ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Cases List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Cases ({cases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading cases...
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No cases found</div>
          ) : (
            <div className="space-y-4">
              {cases.map((caseItem) => (
                <Link
                  key={caseItem.caseId}
                  to={`/case/${caseItem.caseId}`}
                  className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {caseItem.person.name || "Unknown Person"}
                        {caseItem.person.age && (
                          <span className="text-gray-500 ml-2">
                            Age: {caseItem.person.age}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Case ID: {caseItem.caseId}
                      </p>
                      {caseItem.sourceType && (
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getSourceIcon(caseItem.sourceType)}
                            {getSourceLabel(caseItem.sourceType)}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Badge
                      className={getPriorityColor(caseItem.priority.level)}
                    >
                      {caseItem.priority.level}
                    </Badge>
                  </div>

                  {caseItem.aiData?.summary && (
                    <p className="text-sm text-gray-700 mb-2">
                      {caseItem.aiData.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {caseItem.lastSeen?.address || "Unknown location"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(caseItem.createdAt))} ago
                    </span>
                    {caseItem.sightings?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {caseItem.sightings.length} sightings
                      </span>
                    )}
                  </div>

                  {caseItem.person.clothing?.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {caseItem.person.clothing.slice(0, 3).map((item, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getPriorityColor(priority) {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-500";
    case "HIGH":
      return "bg-orange-500";
    case "MEDIUM":
      return "bg-yellow-500";
    case "LOW":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

function getSourceIcon(sourceType) {
  switch (sourceType) {
    case "social_media_auto":
      return "🤖";
    case "telegram":
      return "📱";
    case "whatsapp":
      return "💬";
    case "sms":
      return "📞";
    case "web":
      return "🌐";
    default:
      return "📝";
  }
}

function getSourceLabel(sourceType) {
  switch (sourceType) {
    case "social_media_auto":
      return "Auto-detected";
    case "telegram":
      return "Telegram";
    case "whatsapp":
      return "WhatsApp";
    case "sms":
      return "SMS";
    case "web":
      return "Web Report";
    default:
      return "Manual";
  }
}
