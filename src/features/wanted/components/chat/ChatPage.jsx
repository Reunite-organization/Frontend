import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../hooks/useAuth";
import {
  Send,
  Image as ImageIcon,
  MoreVertical,
  ChevronLeft,
  Shield,
  ArrowLeft,
  MessageCircle,
  Trash2,
  Menu,
  Users,
} from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { useLanguage } from "../../../../lib/i18n";
import { ChatSidebar } from "./ChatSidebar";
import { MessageBubble } from "./MessageBubble";
import { TrustBadge } from "../profile/TrustBadge";
import { ChatSkeleton } from "./ChatSkeleton";
import { toast } from "sonner";
import { wantedApi } from "../../services/wantedApi";

export const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const {
    rooms,
    currentRoom,
    messages,
    sendMessage,
    deleteMessage,
    leaveChat,
    sendTyping,
    typingUsers,
    onlineUsers,
    isLoading,
    isLeavingChat,
  } = useChat(roomId);

  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (roomId && !isLoading && rooms && !currentRoom) {
      navigate("/wanted/chat", { replace: true });
    }
  }, [roomId, isLoading, rooms, currentRoom, navigate]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;
    sendMessage({
      roomId: currentRoom?._id,
      content: messageInput.trim(),
      type: "text",
    });
    setMessageInput("");
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(language === "am" ? "JPEG፣ PNG፣ WEBP ወይም GIF ብቻ" : "Please upload JPEG, PNG, WEBP, or GIF only");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(language === "am" ? "ፋይሉ ከ10MB መብለጥ የለበትም" : "File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await wantedApi.uploadChatPhoto(formData);
      let photoUrl = response?.url || response?.data?.url || response?.photoUrl;
      if (!photoUrl) throw new Error("No URL returned from server");
      try {
        const urlObj = new URL(photoUrl);
        photoUrl = urlObj.pathname;
      } catch {}

      sendMessage({
        roomId: currentRoom?._id,
        content: photoUrl,
        type: "photo",
        metadata: { photoUrl, photoWidth: response?.width || 0, photoHeight: response?.height || 0 },
      });
      toast.success(language === "am" ? "ፎቶ ተልኳል" : "Photo sent");
    } catch (error) {
      toast.error(language === "am" ? "ፎቶ መላክ አልተሳካም" : "Failed to upload photo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteMessage = async (message) => {
    if (!message?._id || String(message._id).startsWith("temp-")) return;
    try {
      await deleteMessage(message._id);
      toast.success(language === "am" ? "መልእክት ተሰርዟል" : "Message deleted");
    } catch {
      toast.error(language === "am" ? "መልእክት መሰረዝ አልተሳካም" : "Unable to delete this message");
    }
  };

  const handleLeaveChat = async (targetRoomId) => {
    const selectedRoomId = targetRoomId || roomId;
    if (!selectedRoomId) return;
    const confirmed = window.confirm(
      language === "am" ? "ይህን ውይይት ይሰርዙ?" : "Delete this chat? The other person will keep their copy."
    );
    if (!confirmed) return;
    try {
      await leaveChat(selectedRoomId);
      toast.success(language === "am" ? "ውይይቱ ተሰርዟል" : "Chat deleted");
      if (String(selectedRoomId) === String(roomId)) {
        navigate("/wanted/chat", { replace: true });
      }
    } catch {
      toast.error(language === "am" ? "ውይይት መሰረዝ አልተሳካም" : "Unable to delete this chat");
    }
  };

  const otherParticipant = currentRoom?.otherUser
    ? { profile: currentRoom.otherUser, user: currentRoom.otherUser.user || currentRoom.otherUser._id }
    : currentRoom?.participants?.find((p) => String(p.user?._id || p.user) !== String(user?.id));

  const otherUserId = otherParticipant?.user?._id || otherParticipant?.user || currentRoom?.otherUser?.user?._id || currentRoom?.otherUser?.user;
  const onlineUserSet = new Set(onlineUsers.map(String));
  const otherParticipantOnline = otherUserId ? onlineUserSet.has(String(otherUserId)) : false;
  const getSenderId = (message) => message?.sender?._id || message?.sender;

  if (isLoading) return <ChatSkeleton />;

  // No room selected - show sidebar + empty state
  if (!roomId) {
    return (
      <div className="h-screen mt-24 flex bg-stone-50 font-sans">
        {/* Sidebar - visible on desktop, hidden on mobile unless toggled */}
        <div className={`${showSidebar ? 'block' : 'hidden'} lg:block`}>
          <ChatSidebar
            rooms={rooms}
            currentRoomId={roomId}
            isOpen={showSidebar}
            onClose={() => setShowSidebar(false)}
            onLeaveRoom={handleLeaveChat}
          />
        </div>
        
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-4">
          {/* Mobile: Show conversations button */}
          <button
            onClick={() => setShowSidebar(true)}
            className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-xl shadow-lg border border-stone-200"
          >
            <Menu className="w-5 h-5 text-stone-600" />
          </button>

          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-stone-400" />
            </div>
            <h2 className="text-xl font-bold text-stone-700 mb-2">
              {language === "am" ? "ውይይት ይምረጡ" : "Select a conversation"}
            </h2>
            <p className="text-sm text-stone-500 mb-4">
              {language === "am" ? "ለመጀመር አንድ ውይይት ይምረጡ" : "Choose a conversation to start chatting"}
            </p>
            {rooms.length > 0 && (
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                {language === "am" ? "ውይይቶች" : "Conversations"} ({rooms.length})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active chat room
  return (
    <div className="h-screen mt-24 flex bg-stone-50 font-sans">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} lg:block`}>
        <ChatSidebar
          rooms={rooms}
          currentRoomId={roomId}
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          onLeaveRoom={handleLeaveChat}
        />
      </div>

      {/* Chat Main Area */}
      <div className="flex-1 flex flex-col bg-white lg:rounded-l-2xl overflow-hidden shadow-lg">
        {/* Chat Header - Minimal */}
        <header className="flex-shrink-0 bg-white border-b border-stone-100 px-3 py-2.5 flex items-center gap-2">
          {/* Back + Sidebar toggle */}
          <button
            onClick={() => setShowSidebar(true)}
            className="lg:hidden p-2 rounded-full hover:bg-stone-100"
          >
            <Menu className="w-5 h-5 text-stone-600" />
          </button>
          <button
            onClick={() => navigate("/wanted")}
            className="hidden sm:flex p-2 rounded-full hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5 text-stone-500" />
          </button>

          {/* User Info */}
          {otherParticipant && (
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center font-semibold text-stone-700 text-sm overflow-hidden">
                  {otherParticipant.profile?.avatarUrl ? (
                    <img src={otherParticipant.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    otherParticipant.profile?.realName?.[0]?.toUpperCase() || "?"
                  )}
                </div>
                {otherParticipantOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-stone-900 truncate">
                  {otherParticipant.profile?.realName || (language === "am" ? "ተጠቃሚ" : "User")}
                </h2>
                <p className="text-[11px] text-stone-400">
                  {typingUsers.length > 0
                    ? language === "am" ? "እየጻፈ..." : "Typing..."
                    : otherParticipantOnline
                    ? language === "am" ? "በመስመር ላይ" : "Online"
                    : language === "am" ? "ከመስመር ውጭ" : "Offline"}
                </p>
              </div>
              <TrustBadge score={otherParticipant.profile?.trustScore} size="sm" />
            </div>
          )}

          {/* Actions */}
          <button
            onClick={() => handleLeaveChat(roomId)}
            disabled={isLeavingChat}
            className="p-2 rounded-full hover:bg-red-50 text-stone-400 hover:text-red-500 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-stone-50/50">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg._id || msg.clientId || index}
                message={msg}
                isOwn={String(getSenderId(msg)) === String(user?.id)}
                showAvatar={index === 0 || String(getSenderId(messages[index - 1])) !== String(getSenderId(msg))}
                onDelete={handleDeleteMessage}
              />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-stone-200" />
                <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Minimal */}
        <div className="border-t border-stone-100 bg-white p-2.5">
          <div className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-2.5 rounded-full hover:bg-stone-100 text-stone-400 transition flex-shrink-0"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onKeyDown={handleKeyDown}
                placeholder={language === "am" ? "መልእክት..." : "Message..."}
                rows={1}
                className="w-full px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-2xl resize-none focus:outline-none focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 transition text-sm"
                style={{ maxHeight: "100px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="p-2.5 bg-stone-900 text-white rounded-full hover:bg-stone-800 disabled:opacity-30 transition flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
