// client/src/features/wanted/hooks/useSocket.js
import { useEffect, useState } from 'react';
import { socketClient } from '../services/socketClient';
import { useAuth } from '../../../hooks/useAuth';

export const useSocket = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    socketClient.connect(user.token);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketClient.on('connect', handleConnect);
    socketClient.on('disconnect', handleDisconnect);

    return () => {
      socketClient.off('connect', handleConnect);
      socketClient.off('disconnect', handleDisconnect);
    };
  }, [user]);

  return {
    isConnected,
    socket: socketClient,
  };
};
