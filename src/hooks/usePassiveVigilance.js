import { useEffect, useState } from "react";
import { Workbox } from "workbox-window";
import { toast } from "sonner";
import { caseService } from "@/services/caseService";

export function usePassiveVigilance(enabled = true) {
  const [permission, setPermission] = useState("default");
  const [serviceWorker, setServiceWorker] = useState(null);
  const [nearbyCases, setNearbyCases] = useState([]);
  const [lastCheck, setLastCheck] = useState(null);

  // Initialize service worker
  useEffect(() => {
    if (!enabled || !("serviceWorker" in navigator)) return;
    if (import.meta.env.DEV) return;

    const wb = new Workbox("/sw.js");

    wb.register()
      .then((registration) => {
        console.log("📱 Service Worker registered");
        setServiceWorker(registration);

        // Setup periodic sync
        if ("periodicSync" in registration) {
          registration.periodicSync.register("location-check", {
            minInterval: 5 * 60 * 1000, // 5 minutes
          });
        }
      })
      .catch((err) => console.error("SW registration failed:", err));

    setServiceWorker(wb);
  }, [enabled]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications not supported");
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      toast.success("You will receive alerts for nearby cases");
      return true;
    } else {
      toast.warning("Notifications disabled. You won't get nearby alerts.");
      return false;
    }
  };

  // Request location permission and start monitoring
  const startMonitoring = async () => {
    if (!("geolocation" in navigator)) {
      toast.error("Location not supported");
      return false;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
        });
      });

      // Store location preference
      localStorage.setItem("passiveVigilance", "true");
      localStorage.setItem(
        "lastLocation",
        JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
        }),
      );

      toast.success("Passive vigilance activated");

      // Check nearby cases immediately
      await checkNearbyCases(position.coords);

      return true;
    } catch (error) {
      console.error("Location error:", error);
      toast.error("Please enable location access");
      return false;
    }
  };

  // Check for nearby cases
  const checkNearbyCases = async (coords) => {
    try {
      const response = await caseService.getNearbyCases(
        coords.latitude,
        coords.longitude,
        2000,
      );
      const cases = response.data || response.cases || [];

      if (cases.length > 0) {
        setNearbyCases(cases);

        if (permission === "granted") {
          new Notification(
            `📍 ${cases.length} Active Case${cases.length > 1 ? "s" : ""} Near You`,
            {
              body: "Tap to see if you can help",
              icon: "/icon-192.png",
              data: { url: "/map" },
            },
          );
        }
      }

      setLastCheck(new Date());
    } catch (error) {
      console.error("Nearby check failed:", error);
    }
  };

  // Quick sighting report (5-second interaction)
  const quickSighting = async (location, details = {}) => {
    try {
      const latitude = location?.latitude ?? location?.lat;
      const longitude = location?.longitude ?? location?.lng;

      if (typeof latitude !== "number" || typeof longitude !== "number") {
        throw new Error("Invalid location for quick sighting");
      }

      const payload = {
        location: {
          lat: latitude,
          lng: longitude,
          address: details.address || undefined,
        },
        description: details.description || "",
        confidence: Number(details.confidence) || 60,
        clothing: Array.isArray(details.clothing) ? details.clothing : [],
        caseId: details.caseId || undefined,
        timestamp: new Date().toISOString(),
      };

      await caseService.quickSighting(payload);

      toast.success("Sighting reported! Thank you!");
      return true;
    } catch (error) {
      console.error("Quick sighting failed:", error);
    }
    return false;
  };

  // Stop monitoring
  const stopMonitoring = () => {
    localStorage.removeItem("passiveVigilance");
    localStorage.removeItem("lastLocation");
    setNearbyCases([]);
    toast.info("Passive vigilance deactivated");
  };

  return {
    permission,
    nearbyCases,
    lastCheck,
    requestNotificationPermission,
    startMonitoring,
    stopMonitoring,
    quickSighting,
    isMonitoring: localStorage.getItem("passiveVigilance") === "true",
  };
}
