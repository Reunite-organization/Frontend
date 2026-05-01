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
    sendTyping,
    typingUsers,
    onlineUsers,
    isLoading,
  } =
    useChat(roomId);

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

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        language === "am"
          ? "እባክዎ JPEG፣ PNG፣ WEBP ወይም GIF ብቻ"
          : "Please upload JPEG, PNG, WEBP, or GIF only",
      );
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        language === "am"
          ? "ፋይሉ ከ10MB መብለጥ የለበትም"
          : "File size must be less than 10MB",
      );
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await wantedApi.uploadChatPhoto(formData);

      console.log("📤 Upload response:", response);

      // ✅ Get the RELATIVE URL from response
      let photoUrl = response?.url || response?.data?.url || response?.photoUrl;

      if (!photoUrl) {
        throw new Error("No URL returned from server");
      }

      try {
        const urlObj = new URL(photoUrl);
        photoUrl = urlObj.pathname;
      } catch {}

      console.log("📸 Sending photo message with URL:", photoUrl);

      sendMessage({
        roomId: currentRoom?._id,
        content: photoUrl,
        type: "photo",
        metadata: {
          photoUrl: photoUrl,
          photoWidth: response?.width || response?.data?.width || 0,
          photoHeight: response?.height || response?.data?.height || 0,
        },
      });

      toast.success(language === "am" ? "ፎቶ ተልኳል" : "Photo sent");
    } catch (error) {
      console.error("❌ Photo upload failed:", error);
      toast.error(
        error.response?.data?.message ||
          (language === "am" ? "ፎቶ መላክ አልተሳካም" : "Failed to upload photo"),
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteMessage = async (message) => {
    if (!message?._id || String(message._id).startsWith("temp-")) return;
    try {
      await wantedApi.deleteMessage(message._id);
      toast.success(language === "am" ? "መልእክት ተሰርዟል" : "Message deleted");
    } catch {
      toast.error(
        language === "am"
          ? "መልእክት መሰረዝ አልተሳካም"
          : "Unable to delete this message",
      );
    }
  };

  const otherParticipant = currentRoom?.otherUser
    ? {
        profile: currentRoom.otherUser,
        user: currentRoom.otherUser.user || currentRoom.otherUser._id,
      }
    : currentRoom?.participants?.find(
        (p) => (p.user?._id || p.user) !== user?.id,
      );

  const otherUserId =
    otherParticipant?.user?._id ||
    otherParticipant?.user ||
    currentRoom?.otherUser?.user?._id ||
    currentRoom?.otherUser?.user;

  const onlineUserSet = new Set(onlineUsers.map(String));
  const otherParticipantOnline = otherUserId
    ? onlineUserSet.has(String(otherUserId))
    : false;

  if (isLoading) {
    return <ChatSkeleton />;
  }

  if (!roomId) {
    return (
      <div className="mt-19 h-screen flex bg-gray-50 font-sans">
        <ChatSidebar
          rooms={rooms}
          currentRoomId={roomId}
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
        />
        <div className="hidden lg:flex flex-1 items-center justify-center px-8">
          <div className="text-center max-w-md mx-auto text-gray-400 space-y-4">
            <MessageCircle className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">
              {language === "am" ? "ውይይት ይምረጡ" : "Select a conversation"}
            </h3>
            <p className="text-sm">
              {language === "am"
                ? "ለመጀመር ከግራ በኩል ውይይት ይምረጡ"
                : "Choose a conversation from the sidebar to start chatting"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 font-sans">
      <ChatSidebar
        rooms={rooms}
        currentRoomId={roomId}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />

      <div className="flex-1 flex flex-col bg-white shadow-lg rounded-l-2xl overflow-hidden">
        {/* Chat Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/wanted")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === "am" ? "ተመለስ" : "Back"}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === "am" ? "ማውጫ" : "Menu"}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {otherParticipant && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 text-lg shadow-md overflow-hidden">
                  {otherParticipant.profile?.avatarUrl ? (
                    <img
                      src={otherParticipant.profile.avatarUrl}
                      alt={otherParticipant.profile.realName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    otherParticipant.profile?.realName?.[0]?.toUpperCase() ||
                    "?"
                  )}
                </div>
                {otherParticipantOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">
                  {otherParticipant.profile?.realName ||
                    (language === "am" ? "ተጠቃሚ" : "User")}
                </h2>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <TrustBadge
                    score={otherParticipant.profile?.trustScore}
                    size="sm"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {typingUsers.length > 0 ? (
                    <span className="text-green-500">
                      {language === "am" ? "እየጻፈ ነው..." : "Typing..."}
                    </span>
                  ) : otherParticipantOnline ? (
                    language === "am" ? (
                      "በመስመር ላይ"
                    ) : (
                      "Online"
                    )
                  ) : language === "am" ? (
                    "ከመስመር ውጭ"
                  ) : (
                    "Offline"
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === "am" ? "ተጨማሪ" : "More"}
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>
            {language === "am"
              ? "አሁን በአስተማማኝ ሁኔታ ተገናኝተዋል! በነፃነት ይነጋገሩ።"
              : "You are now safely connected! Feel free to chat."}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg._id || msg.clientId || index}
                message={msg}
                isOwn={
                  msg.sender === user?.id ||
                  msg.sender?._id === user?.id
                }
                showAvatar={
                  index === 0 || messages[index - 1]?.sender !== msg.sender
                }
                onDelete={handleDeleteMessage}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 shadow-md" />
                <div className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 shadow-sm">
                  <div className="flex space-x-2">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4 shadow-inner">
          <div className="flex items-center space-x-3">
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
              className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
              title={language === "am" ? "ፎቶ አያይዝ" : "Attach photo"}
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ImageIcon className="w-5 h-5 text-gray-600" />
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
                placeholder={
                  language === "am" ? "መልእክት ይጻፉ..." : "Type a message..."
                }
                rows={1}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                style={{ maxHeight: "120px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
