import React from 'react';
import { Wifi, WifiOff, RefreshCw, Trash2 } from 'lucide-react';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { useLanguage } from '../../../../lib/i18n';

export const OfflineIndicator = () => {
  const { language } = useLanguage();
  const { isOnline, isSyncing, pendingCount, syncOfflineData, clearQueue } = useOfflineSync();

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full shadow-lg ${
        isOnline ? 'bg-hope-green/10 border border-hope-green/30' : 'bg-warmth/10 border border-warmth/30'
      }`}>
        {isOnline ? (
          <Wifi className="w-4 h-4 text-hope-green" />
        ) : (
          <WifiOff className="w-4 h-4 text-warmth" />
        )}
        
        <span className="text-sm text-charcoal">
          {!isOnline ? (
            language === 'am' ? 'ከመስመር ውጭ' : 'Offline'
          ) : pendingCount > 0 ? (
            language === 'am' 
              ? `${pendingCount} በመጠባበቅ ላይ`
              : `${pendingCount} pending`
          ) : null}
        </span>

        {isOnline && pendingCount > 0 && (
          <>
            <button
              onClick={() => syncOfflineData()}
              disabled={isSyncing}
              className="p-1 text-stone hover:text-charcoal transition-colors"
              title={language === 'am' ? 'አሁን አስምር' : 'Sync now'}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={clearQueue}
              className="p-1 text-stone hover:text-error transition-colors"
              title={language === 'am' ? 'ወረፋ አጽዳ' : 'Clear queue'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
