import { useEffect, useState } from 'react';
import { socketClient } from '../services/socketClient';
import { useAuth } from '../../../hooks/useAuth';

export const useSocket = () => {
  const { user, getAccessToken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const token = getAccessToken();

    if (!token) {
      setIsConnected(false);
      return;
    }

    socketClient.connect(token);
    setIsConnected(socketClient.isConnected());

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketClient.on('connect', handleConnect);
    socketClient.on('disconnect', handleDisconnect);

    return () => {
      socketClient.off('connect', handleConnect);
      socketClient.off('disconnect', handleDisconnect);
    };
  }, [getAccessToken, user]);

  return {
    isConnected,
    socket: socketClient,
  };
};
