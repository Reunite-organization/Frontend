import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIAssistant from "./AIAssistant";
import { usePassiveVigilance } from "@/hooks/usePassiveVigilance";
import { MapPin, Navigation, ExternalLink, Radio, Route } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { caseService } from "@/services/caseService";
import useMapStore from "./mapStore";

const DEFAULT_CENTER = { lat: 9.032, lng: 38.7469 };

const toGoogleMapUrl = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;
const toDirectionsUrl = (from, to) =>
  `https://www.google.com/maps/dir/${from.lat},${from.lng}/${to.lat},${to.lng}`;

const kmDistance = (from, to) => {
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function DualMapView({ caseData: propCaseData }) {
  const navigate = useNavigate();
  const { location: userLocation, getCurrentLocation } = useLocation();
  const { selectedCase: storeSelectedCase, setSelectedCase, setMapMode } = useMapStore();
  const { nearbyCases: vigilanceNearbyCases } = usePassiveVigilance();

  const [nearbyCases, setNearbyCases] = useState([]);
  const [liveMode, setLiveMode] = useState(true);
  const [refreshingLive, setRefreshingLive] = useState(false);
  const [lastLiveRefresh, setLastLiveRefresh] = useState(null);
  const [selectedNearbyCaseId, setSelectedNearbyCaseId] = useState(null);

  const effectiveCaseData = propCaseData || storeSelectedCase;
  const userPoint = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : DEFAULT_CENTER;

  const focusPoint = useMemo(() => {
    if (selectedNearbyCaseId) {
      const selected = nearbyCases.find((c) => c.caseId === selectedNearbyCaseId);
      const coords = selected?.lastSeen?.location?.coordinates;
      if (coords?.length === 2) return { lat: coords[1], lng: coords[0] };
    }

    const caseCoords = effectiveCaseData?.lastSeen?.location?.coordinates;
    if (caseCoords?.length === 2) return { lat: caseCoords[1], lng: caseCoords[0] };
    return userPoint;
  }, [selectedNearbyCaseId, nearbyCases, effectiveCaseData, userPoint]);

  const loadNearbyCases = async (lat, lng) => {
    setRefreshingLive(true);
    try {
      const response = await caseService.getNearbyCases(lat, lng, 10000);
      setNearbyCases(response.data || []);
      setLastLiveRefresh(new Date());
    } finally {
      setRefreshingLive(false);
    }
  };

  useEffect(() => {
    if (!userLocation) return;
    loadNearbyCases(userLocation.latitude, userLocation.longitude);
  }, [userLocation?.latitude, userLocation?.longitude]);

  useEffect(() => {
    if (!liveMode || !userLocation) return;
    const id = setInterval(() => {
      loadNearbyCases(userLocation.latitude, userLocation.longitude);
    }, 30000);
    return () => clearInterval(id);
  }, [liveMode, userLocation?.latitude, userLocation?.longitude]);

  const openInGoogleMaps = () => {
    window.open(toGoogleMapUrl(focusPoint.lat, focusPoint.lng), "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2">
          <Button variant="outline" onClick={getCurrentLocation}>
            <Navigation className="w-4 h-4 mr-2" />
            Update Location
          </Button>
          <Button variant={liveMode ? "default" : "outline"} onClick={() => setLiveMode((v) => !v)}>
            <Radio className="w-4 h-4 mr-2" />
            {liveMode ? "Live ON" : "Live OFF"}
          </Button>
        </div>
        <Button variant="outline" onClick={openInGoogleMaps}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in Google Maps
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary">
          {refreshingLive
            ? "Refreshing live feed..."
            : `Last update: ${lastLiveRefresh ? lastLiveRefresh.toLocaleTimeString() : "Not yet"}`}
        </Badge>
        <Badge variant="outline">
          Nearby cases: {nearbyCases.length}
        </Badge>
        <Badge variant="outline">
          Passive alerts: {vigilanceNearbyCases.length}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <iframe
            title="Reunite Live Map"
            src={toGoogleMapUrl(focusPoint.lat, focusPoint.lng)}
            className="w-full h-[520px] rounded-lg"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Live Nearby Feed</h3>
            {nearbyCases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active nearby cases right now.</p>
            ) : (
              nearbyCases.slice(0, 8).map((caseItem) => {
                const coords = caseItem.lastSeen?.location?.coordinates;
                const casePoint =
                  coords?.length === 2 ? { lat: coords[1], lng: coords[0] } : null;
                const distance = casePoint ? kmDistance(userPoint, casePoint) : null;
                return (
                  <div key={caseItem.caseId} className="border rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{caseItem.person?.name || "Unknown person"}</p>
                      <Badge>{caseItem.priority?.level || "MEDIUM"}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Age: {caseItem.person?.age ?? "N/A"} | Distance: {distance ? `${distance.toFixed(1)} km` : "N/A"}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedNearbyCaseId(caseItem.caseId)}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        Focus
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/cases/${caseItem.caseId}`)}
                      >
                        Open Case
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Case Direction Panel</h3>
            {!effectiveCaseData?.lastSeen?.location?.coordinates ? (
              <p className="text-sm text-muted-foreground">
                Open a case to get route guidance and timeline context.
              </p>
            ) : (
              <>
                <p className="text-sm">
                  <strong>{effectiveCaseData.person?.name || "Unknown person"}</strong> | Age:{" "}
                  {effectiveCaseData.person?.age ?? "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {effectiveCaseData.lastSeen?.address || "No last-seen address"}
                </p>
                <Button
                  onClick={() => {
                    const coords = effectiveCaseData.lastSeen.location.coordinates;
                    window.open(
                      toDirectionsUrl(userPoint, { lat: coords[1], lng: coords[0] }),
                      "_blank",
                    );
                  }}
                >
                  <Route className="w-4 h-4 mr-2" />
                  Get Search Direction
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <AIAssistant caseData={effectiveCaseData} userLocation={userLocation} />
    </div>
  );
}
