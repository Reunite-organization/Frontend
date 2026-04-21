import { useEffect, useCallback, useState } from 'react';
import { offlineStorage } from '../services/offlineStorage';
import { wantedApi } from '../services/wantedApi';
import { useLanguage } from '../../../lib/i18n';
import { toast } from 'sonner';

export const useOfflineSync = () => {
  const { language } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  const updatePendingCount = useCallback(async () => {
    const items = await offlineStorage.getQueueItems();
    setPendingCount(items.length);
  }, []);

  const syncOfflineData = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;

    setIsSyncing(true);
    const queueItems = await offlineStorage.getQueueItems();
    
    if (queueItems.length === 0) {
      setIsSyncing(false);
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const item of queueItems) {
      try {
        // Update attempt count
        await offlineStorage.updateQueueItem(item.id, {
          attempts: (item.attempts || 0) + 1,
          lastAttempt: Date.now(),
        });

        // Process based on action type
        switch (item.action) {
          case 'createPost':
            await wantedApi.createPost(item.data);
            break;
          case 'sendMessage':
            await wantedApi.sendMessage(item.data.roomId, item.data);
            break;
          case 'submitClaim':
            await wantedApi.submitClaim(item.data.postId, item.data);
            break;
          case 'updateProfile':
            await wantedApi.updateProfile(item.data);
            break;
          default:
            console.warn('Unknown action:', item.action);
        }

        await offlineStorage.removeFromQueue(item.id);
        successCount++;
      } catch (error) {
        console.error('Failed to sync item:', item, error);
        failCount++;

        // Remove after 5 failed attempts
        if (item.attempts >= 5) {
          await offlineStorage.removeFromQueue(item.id);
        }
      }
    }

    if (successCount > 0) {
      toast.success(
        language === 'am'
          ? `${successCount} ንጥሎች ተመሳስለዋል`
          : `Synced ${successCount} items`
      );
    }

    await updatePendingCount();
    setIsSyncing(false);
  }, [language, isSyncing]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success(
        language === 'am' ? 'እንደገና ተገናክተዋል!' : 'You\'re back online!'
      );
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning(
        language === 'am'
          ? 'ከመስመር ውጭ ነዎት። ለውጦች ይቀመጣሉ።'
          : 'You\'re offline. Changes will be saved locally.'
      );
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language, syncOfflineData]);

  // Listen for service worker sync messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'SYNC_TRIGGERED') {
        syncOfflineData();
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);
    
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [syncOfflineData]);

  // Initial sync and pending count
  useEffect(() => {
    if (navigator.onLine) {
      syncOfflineData();
    }
    updatePendingCount();
  }, [syncOfflineData, updatePendingCount]);

  // Cleanup old data periodically
  useEffect(() => {
    const cleanup = async () => {
      await offlineStorage.cleanup();
    };

    const interval = setInterval(cleanup, 24 * 60 * 60 * 1000); // Daily
    cleanup(); // Initial cleanup

    return () => clearInterval(interval);
  }, []);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    syncOfflineData,
  };
};
