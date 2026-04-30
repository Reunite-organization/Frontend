import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/services/api";
// Simple IndexedDB wrapper for offline storage
class OfflineStorage {
  constructor() {
    this.dbName = "ReuniteOfflineDB";
    this.dbVersion = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create stores
        if (!db.objectStoreNames.contains("reports")) {
          db.createObjectStore("reports", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains("syncQueue")) {
          db.createObjectStore("syncQueue", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };
    });
  }

  async saveReport(reportData) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        ["reports", "syncQueue"],
        "readwrite",
      );
      const reportsStore = transaction.objectStore("reports");
      const syncStore = transaction.objectStore("syncQueue");

      const report = {
        ...reportData,
        createdAt: new Date().toISOString(),
        synced: false,
      };

      const reportRequest = reportsStore.add(report);

      reportRequest.onsuccess = () => {
        // Add to sync queue
        syncStore.add({
          type: "CREATE_REPORT",
          data: report,
          reportId: reportRequest.result,
          createdAt: new Date().toISOString(),
        });

        resolve(reportRequest.result);
      };

      reportRequest.onerror = () => reject(reportRequest.error);
    });
  }

  async getPendingSyncs() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["syncQueue"], "readonly");
      const store = transaction.objectStore("syncQueue");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSynced(id) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["syncQueue"], "readwrite");
      const store = transaction.objectStore("syncQueue");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

const storage = new OfflineStorage();

export function useOffline() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSyncs, setPendingSyncs] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Back online! Syncing data...");
      syncPendingReports();
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.warning("You are offline. Reports will be saved locally.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check pending syncs on mount
    checkPendingSyncs();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkPendingSyncs = async () => {
    try {
      const pending = await storage.getPendingSyncs();
      setPendingSyncs(pending.length);
    } catch (error) {
      console.error("Failed to check pending syncs:", error);
    }
  };

  const saveOfflineReport = async (reportData) => {
    try {
      const id = await storage.saveReport(reportData);
      await checkPendingSyncs();
      return id;
    } catch (error) {
      console.error("Failed to save offline report:", error);
      toast.error("Failed to save report offline");
      throw error;
    }
  };

  const syncPendingReports = async () => {
    if (isOffline) return;

    try {
      const pending = await storage.getPendingSyncs();

      for (const item of pending) {
        try {
          // Attempt to sync with backend using api service
          const response = await api.post("/cases", item.data);

          if (response) {
            await storage.clearSynced(item.id);
            toast.success("Offline report synced successfully");
          }
        } catch (error) {
          console.error("Failed to sync item:", item.id, error);
          toast.error("Failed to sync offline report");
        }
      }

      await checkPendingSyncs();
    } catch (error) {
      console.error("Sync failed:", error);
      toast.error("Offline sync failed");
    }
  };

  return {
    isOffline,
    pendingSyncs,
    saveOfflineReport,
    syncPendingReports,
  };
}
