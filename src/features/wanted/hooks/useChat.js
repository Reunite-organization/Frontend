import { useState, useEffect, useCallback, useRef } from "react";
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
  // Track online presence for any participant id.
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  // Store roomId in a ref to avoid stale closures
  const roomIdRef = useRef(roomId);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  // Get chat rooms
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["wanted", "chat", "rooms"],
    queryFn: () => wantedApi.getChatRooms(),
    staleTime: 30 * 1000,
  });

  // Get current room
  const currentRoom = rooms?.find((r) => r._id === roomId);

  const removeRoomFromCaches = useCallback(
    (targetRoomId) => {
      if (!targetRoomId) return;
      const normalizedRoomId = String(targetRoomId);

      queryClient.setQueryData(["wanted", "chat", "rooms"], (old = []) =>
        old.filter((room) => String(room._id) !== normalizedRoomId),
      );
      queryClient.removeQueries({
        queryKey: ["wanted", "chat", "messages", normalizedRoomId],
      });

      offlineStorage.deleteMessagesForRoom(normalizedRoomId).catch((error) => {
        console.warn("Failed to remove cached chat messages:", error);
      });
    },
    [queryClient],
  );

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
        // Sync with offline storage
        if (serverMessages.length > 0) {
          await Promise.all(serverMessages.map(m => offlineStorage.cacheMessage({ ...m, synced: true })));
        }
        return serverMessages;
      } catch {
        // Return cached if offline
        return cached || [];
      }
    },
    enabled: !!roomId,
    staleTime: 5 * 1000,
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

    const handleConnect = () => {
      setIsConnected(true);
      // Re-join room on reconnect
      if (roomIdRef.current) {
        socketClient.emit("join-room", roomIdRef.current);
      }
    };
    const handleDisconnect = () => setIsConnected(false);

    const handleUserStatus = ({ userId, isOnline }) => {
      if (!userId) return;
      const normalized = String(userId);
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (isOnline) next.add(normalized);
        else next.delete(normalized);
        return next;
      });
    };

    socketClient.on("connect", handleConnect);
    socketClient.on("disconnect", handleDisconnect);
    socketClient.on("user-status", handleUserStatus);

    // Join room if roomId exists
    if (roomId) {
      socketClient.emit("join-room", roomId);
    }

    return () => {
      socketClient.off("connect", handleConnect);
      socketClient.off("disconnect", handleDisconnect);
      socketClient.off("user-status", handleUserStatus);
      
      if (roomId) {
        socketClient.emit("leave-room", roomId);
      }
    };
  }, [user, getAccessToken, roomId]); 

  useEffect(() => {
    if (!socketClient) return;

    const handleNewMessage = (message) => {
      const currentRoomId = roomIdRef.current;
      
      if (!message?.chatRoom || !currentRoomId) return;
      
      const messageRoomId = typeof message.chatRoom === 'object' 
        ? message.chatRoom._id || message.chatRoom 
        : message.chatRoom;
      
      if (String(messageRoomId) !== String(currentRoomId)) return;

      queryClient.setQueryData(
        ["wanted", "chat", "messages", currentRoomId],
        (old = []) => {
          // Check for existing message by ID or tempId
          const exists = old.find(m => 
            m._id === message._id || 
            (m.pending && message.metadata?.clientRequestId && m.metadata?.clientRequestId === message.metadata?.clientRequestId)
          );
          
          if (exists) {
            return old.map(m => {
              if (m._id === message._id) return { ...message, pending: false };
              if (m.pending && message.metadata?.clientRequestId && m.metadata?.clientRequestId === message.metadata?.clientRequestId) {
                return { ...message, pending: false };
              }
              return m;
            });
          }
          
          // Add new message
          return [...old, { ...message, pending: false }];
        }
      );
      
      // Invalidate rooms query to update last message
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
      const currentRoomId = roomIdRef.current;
      if (!currentRoomId) return;
      
      queryClient.setQueryData(
        ["wanted", "chat", "messages", currentRoomId],
        (old = []) =>
          old.map((msg) =>
            messageIds.includes(msg._id)
              ? {
                  ...msg,
                  readBy: [
                    ...(msg.readBy || []),
                    { user: userId, readAt: new Date().toISOString() },
                  ],
                }
              : msg
          )
      );
    };

    const handleMessageDeleted = ({ messageId, roomId: deletedRoomId }) => {
      const targetRoomId = deletedRoomId || roomIdRef.current;
      if (!targetRoomId || !messageId) return;
      queryClient.setQueryData(
        ["wanted", "chat", "messages", String(targetRoomId)],
        (old = []) => old.filter((msg) => msg._id !== messageId),
      );
      offlineStorage.deleteMessage(messageId).catch((error) => {
        console.warn("Failed to remove cached message:", error);
      });
      queryClient.invalidateQueries({ queryKey: ["wanted", "chat", "rooms"] });
    };

    const handleChatRemoved = ({ roomId: removedRoomId }) => {
      if (!removedRoomId) return;
      removeRoomFromCaches(removedRoomId);
    };

    socketClient.on("new-message", handleNewMessage);
    socketClient.on("user-typing", handleUserTyping);
    socketClient.on("messages-read", handleMessagesRead);
    socketClient.on("message-deleted", handleMessageDeleted);
    socketClient.on("chat-left", handleChatRemoved);
    socketClient.on("chat-removed", handleChatRemoved);

    return () => {
      socketClient.off("new-message", handleNewMessage);
      socketClient.off("user-typing", handleUserTyping);
      socketClient.off("messages-read", handleMessagesRead);
      socketClient.off("message-deleted", handleMessageDeleted);
      socketClient.off("chat-left", handleChatRemoved);
      socketClient.off("chat-removed", handleChatRemoved);
    };
  }, [queryClient, removeRoomFromCaches]);

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId) => wantedApi.deleteMessage(messageId),
    onMutate: async (messageId) => {
      const currentRoomId = roomIdRef.current;
      if (!currentRoomId) return {};

      await queryClient.cancelQueries({
        queryKey: ["wanted", "chat", "messages", currentRoomId],
      });

      const previousMessages = queryClient.getQueryData([
        "wanted",
        "chat",
        "messages",
        currentRoomId,
      ]);

      queryClient.setQueryData(
        ["wanted", "chat", "messages", currentRoomId],
        (old = []) => old.filter((msg) => msg._id !== messageId),
      );

      offlineStorage.deleteMessage(messageId).catch((error) => {
        console.warn("Failed to remove cached message:", error);
      });

      return {
        roomId: currentRoomId,
        previousMessages,
      };
    },
    onError: (_error, _messageId, context) => {
      if (!context?.roomId || !context?.previousMessages) return;
      queryClient.setQueryData(
        ["wanted", "chat", "messages", context.roomId],
        context.previousMessages,
      );
      const deletedMessage = context.previousMessages.find(
        (message) => message._id === _messageId,
      );
      if (deletedMessage) {
        offlineStorage.cacheMessage(deletedMessage).catch((error) => {
          console.warn("Failed to restore cached message:", error);
        });
      }
    },
    onSettled: (_data, _error, _messageId, context) => {
      if (context?.roomId) {
        queryClient.invalidateQueries({
          queryKey: ["wanted", "chat", "messages", context.roomId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["wanted", "chat", "rooms"] });
    },
  });

  const leaveChatMutation = useMutation({
    mutationFn: (targetRoomId) => wantedApi.leaveChat(targetRoomId),
    onMutate: async (targetRoomId) => {
      if (!targetRoomId) return {};

      await queryClient.cancelQueries({ queryKey: ["wanted", "chat", "rooms"] });
      const previousRooms = queryClient.getQueryData(["wanted", "chat", "rooms"]);
      const normalizedRoomId = String(targetRoomId);
      const previousMessages = queryClient.getQueryData([
        "wanted",
        "chat",
        "messages",
        normalizedRoomId,
      ]);
      removeRoomFromCaches(targetRoomId);

      return {
        roomId: normalizedRoomId,
        previousRooms,
        previousMessages,
      };
    },
    onError: (_error, _targetRoomId, context) => {
      if (context?.previousRooms) {
        queryClient.setQueryData(["wanted", "chat", "rooms"], context.previousRooms);
      }
      if (context?.roomId && context?.previousMessages) {
        queryClient.setQueryData(
          ["wanted", "chat", "messages", context.roomId],
          context.previousMessages,
        );
        offlineStorage.cacheMessages(context.roomId, context.previousMessages).catch((error) => {
          console.warn("Failed to restore cached chat messages:", error);
        });
      }
    },
    onSuccess: (_data, targetRoomId) => {
      socketClient.emit("leave-room", targetRoomId);
      removeRoomFromCaches(targetRoomId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wanted", "chat", "rooms"] });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, type = "text", metadata = {} }) => {
      const currentRoomId = roomIdRef.current;
      if (!currentRoomId) throw new Error("No room selected");

      const tempId = `temp-${Date.now()}`;
      const clientRequestId = tempId;
      const requestMetadata = { ...metadata, clientRequestId };
      
      const tempMessage = {
        _id: tempId,
        chatRoom: currentRoomId,
        sender: user.id,
        content,
        type,
        metadata: requestMetadata,
        createdAt: new Date().toISOString(),
        pending: true,
      };

      // Optimistic update
      queryClient.setQueryData(
        ["wanted", "chat", "messages", currentRoomId],
        (old = []) => [...old, tempMessage]
      );

      try {
        const message = await wantedApi.sendMessage(currentRoomId, {
          content,
          type,
          metadata: requestMetadata,
        });
        
        // Cache message for offline
        await offlineStorage.cacheMessage({ ...message, synced: true });
        
        return message;
      } catch (error) {
        // Queue for offline sync
        await offlineStorage.addToQueue("sendMessage", {
          roomId: currentRoomId,
          content,
          type,
          metadata: requestMetadata,
        });
        throw error;
      }
    },
    onSuccess: (message) => {
      const currentRoomId = roomIdRef.current;
      if (!currentRoomId) return;
      
      queryClient.setQueryData(
        ["wanted", "chat", "messages", currentRoomId],
        (old = []) =>
          old.map((entry) => {
            const sameRequest =
              entry.pending &&
              entry.metadata?.clientRequestId &&
              message.metadata?.clientRequestId &&
              entry.metadata.clientRequestId === message.metadata.clientRequestId;

            return sameRequest ? { ...message, pending: false } : entry;
          })
      );
      queryClient.invalidateQueries({ queryKey: ["wanted", "chat", "rooms"] });
    },
    onError: (_error, variables) => {
      const currentRoomId = roomIdRef.current;
      if (!currentRoomId) return;
      
      const requestId = variables.metadata?.clientRequestId;
      if (requestId) {
        queryClient.setQueryData(
          ["wanted", "chat", "messages", currentRoomId],
          (old = []) =>
            old.map((entry) =>
              entry.pending && entry.metadata?.clientRequestId === requestId
                ? { ...entry, pending: false, failed: true }
                : entry
            )
        );
      }
    },
  });

  const sendTyping = useCallback(
    (isTyping) => {
      const currentRoomId = roomIdRef.current;
      if (!currentRoomId) return;
      socketClient.emit("typing", { roomId: currentRoomId, isTyping });
    },
    [] 
  );

  // Mark messages as read
  const markAsRead = useCallback(
    (messageIds) => {
      const currentRoomId = roomIdRef.current;
      if (!currentRoomId) return;
      socketClient.emit("mark-read", { roomId: currentRoomId, messageIds });
    },
    [] 
  );

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
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
    onlineUsers: Array.from(onlineUsers),
    sendMessage: sendMessageMutation.mutate,
    deleteMessage: deleteMessageMutation.mutateAsync,
    leaveChat: leaveChatMutation.mutateAsync,
    sendTyping,
    markAsRead,
    uploadPhoto: uploadPhotoMutation.mutate,
    isUploading: uploadPhotoMutation.isPending,
    isDeletingMessage: deleteMessageMutation.isPending,
    isLeavingChat: leaveChatMutation.isPending,
  };
};
