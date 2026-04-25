import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wantedApi } from "../services/wantedApi";
import { socketClient } from "../services/socketClient";
import { offlineStorage } from "../services/offlineStorage";
import { useAuth } from "../../../hooks/useAuth";

export const useChat = (roomId) => {
  const { user, getAccessToken } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());

  // Get chat rooms
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["wanted", "chat", "rooms"],
    queryFn: () => wantedApi.getChatRooms(),
    staleTime: 60 * 1000,
  });

  // Get current room
  const currentRoom = rooms?.find((r) => r._id === roomId);

  // Get messages for current room
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["wanted", "chat", "messages", roomId],
    queryFn: async () => {
      if (!roomId) return [];

      // Try to get cached messages first
      const cached = await offlineStorage.getCachedMessages(roomId);

      // Fetch from server
      try {
        const serverMessages = await wantedApi.getChatMessages(roomId);
        return serverMessages;
      } catch (error) {
        // Return cached if offline
        return cached;
      }
    },
    enabled: !!roomId,
    staleTime: 10 * 1000,
  });

  // Socket connection
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
    const handleNewMessage = (message) => {
      if (message.chatRoom === roomId) {
        queryClient.setQueryData(
          ["wanted", "chat", "messages", roomId],
          (old = []) => {
            const existingIndex = old.findIndex(
              (entry) => entry._id === message._id,
            );
            const requestId = message.metadata?.clientRequestId;
            const pendingIndex = requestId
              ? old.findIndex(
                  (entry) =>
                    entry.pending &&
                    entry.metadata?.clientRequestId === requestId,
                )
              : -1;

            if (existingIndex >= 0) {
              return old.map((entry, index) =>
                index === existingIndex ? message : entry,
              );
            }
            if (processedMessageIds.current.has(message._id)) {
              return; // Skip duplicate
            }
            processedMessageIds.current.add(message._id);

            if (pendingIndex >= 0) {
              return old.map((entry, index) =>
                index === pendingIndex ? message : entry,
              );
            }

            return [...old, message];
          },
        );
      }
      queryClient.invalidateQueries({ queryKey: ["wanted", "chat", "rooms"] });
    };

    const handleUserTyping = ({ userId, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (isTyping) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });
    };

    const handleMessagesRead = ({ userId, messageIds }) => {
      queryClient.setQueryData(
        ["wanted", "chat", "messages", roomId],
        (old = []) =>
          old.map((msg) =>
            messageIds.includes(msg._id)
              ? {
                  ...msg,
                  readBy: [
                    ...(msg.readBy || []),
                    { user: userId, readAt: new Date() },
                  ],
                }
              : msg,
          ),
      );
    };

    socketClient.on("connect", handleConnect);
    socketClient.on("disconnect", handleDisconnect);
    socketClient.on("new-message", handleNewMessage);
    socketClient.on("user-typing", handleUserTyping);
    socketClient.on("messages-read", handleMessagesRead);

    // Join room
    if (roomId) {
      socketClient.emit("join-room", roomId);
    }

    return () => {
      socketClient.off("connect", handleConnect);
      socketClient.off("disconnect", handleDisconnect);
      socketClient.off("new-message", handleNewMessage);
      socketClient.off("user-typing", handleUserTyping);
      socketClient.off("messages-read", handleMessagesRead);

      if (roomId) {
        socketClient.emit("leave-room", roomId);
      }
    };
  }, [getAccessToken, user, roomId, queryClient]);

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, type = "text", metadata = {} }) => {
      const tempId = `temp-${Date.now()}`;
      const clientRequestId = tempId;
      metadata.clientRequestId = clientRequestId;
      const requestMetadata = { ...metadata, clientRequestId };
      const tempMessage = {
        _id: tempId,
        chatRoom: roomId,
        sender: user.id,
        content,
        type,
        metadata: requestMetadata,
        createdAt: new Date().toISOString(),
        pending: true,
      };

      // Optimistic update
      queryClient.setQueryData(
        ["wanted", "chat", "messages", roomId],
        (old = []) => [...old, tempMessage],
      );

      try {
        const message = await wantedApi.sendMessage(roomId, {
          content,
          type,
          metadata: requestMetadata,
        });
        await offlineStorage.cacheMessage({ ...message, synced: true });
        return message;
      } catch (error) {
        await offlineStorage.addToQueue("sendMessage", {
          roomId,
          content,
          type,
          metadata: requestMetadata,
        });
        throw error;
      }
    },
    onSuccess: (message) => {
      queryClient.setQueryData(
        ["wanted", "chat", "messages", roomId],
        (old = []) =>
          old.map((entry) => {
            const sameRequest =
              entry.pending &&
              entry.metadata?.clientRequestId &&
              entry.metadata.clientRequestId ===
                message.metadata?.clientRequestId;

            return sameRequest ? message : entry;
          }),
      );
      queryClient.invalidateQueries({ queryKey: ["wanted", "chat", "rooms"] });
    },
    onError: (_error, variables) => {
      const requestId = variables.metadata?.clientRequestId;
      queryClient.setQueryData(
        ["wanted", "chat", "messages", roomId],
        (old = []) =>
          old.filter(
            (entry) =>
              !(
                entry.pending &&
                requestId &&
                entry.metadata?.clientRequestId === requestId
              ),
          ),
      );
    },
  });

  // Send typing indicator
  const sendTyping = useCallback(
    (isTyping) => {
      socketClient.emit("typing", { roomId, isTyping });
    },
    [roomId],
  );

  // Mark as read
  const markAsRead = useCallback(
    (messageIds) => {
      socketClient.emit("mark-read", { roomId, messageIds });
    },
    [roomId],
  );

  // Upload photo
  const uploadPhoto = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("photo", file);
      return wantedApi.uploadChatPhoto(formData);
    },
  });

  return {
    rooms,
    currentRoom,
    messages,
    isLoading: roomsLoading || messagesLoading,
    isConnected,
    typingUsers: Array.from(typingUsers),
    sendMessage: sendMessageMutation.mutate,
    sendTyping,
    markAsRead,
    uploadPhoto: uploadPhoto.mutate,
    isUploading: uploadPhoto.isPending,
  };
};
