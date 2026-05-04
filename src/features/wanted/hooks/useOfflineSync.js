import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../services/api";
import { offlineStorage } from "../services/offlineStorage";

const SYNCABLE_ACTIONS = {
  createMissingCaseReport: async (payload) => {
    const formData = new FormData();

    Object.entries(payload.fields || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    return api.post("/cases/report", formData);
  },
  createQuickSighting: async (payload) => api.post("/cases/quick", payload),
};

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = useCallback(async () => {
    try {
      const items = await offlineStorage.getQueueItems();
      setPendingCount(items.length);
      return items;
    } catch (error) {
      console.error("Failed to load offline queue:", error);
      setPendingCount(0);
      return [];
    }
  }, []);

  const clearQueue = useCallback(async () => {
    await offlineStorage.clearQueue();
    setPendingCount(0);
    toast.success("Offline queue cleared.");
  }, []);

  const syncOfflineData = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      const items = await refreshPendingCount();

      for (const item of items.sort((a, b) => a.timestamp - b.timestamp)) {
        const handler = SYNCABLE_ACTIONS[item.action];

        if (!handler) {
          await offlineStorage.removeFromQueue(item.id);
          continue;
        }

        try {
          await handler(item.data);
          await offlineStorage.removeFromQueue(item.id);
        } catch (error) {
          await offlineStorage.updateQueueItem(item.id, {
            attempts: Number(item.attempts || 0) + 1,
            lastAttempt: Date.now(),
          });
          console.error("Offline sync item failed:", item.action, error);
        }
      }

      const remaining = await refreshPendingCount();
    } catch (error) {
      console.error("Offline sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, refreshPendingCount]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    void refreshPendingCount();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [refreshPendingCount]);

  useEffect(() => {
    if (isOnline) {
      void syncOfflineData();
    }
  }, [isOnline, syncOfflineData]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    syncOfflineData,
    clearQueue,
    refreshPendingCount,
  };
};
