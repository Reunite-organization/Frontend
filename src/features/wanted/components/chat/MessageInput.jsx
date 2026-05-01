import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Image,
  File,
  X,
  Smile,
  Mic,
  StopCircle,
} from "lucide-react";
import { useLanguage } from "../../../../lib/i18n";
import { toast } from "sonner";
import { wantedApi } from "../../services/wantedApi";

export const MessageInput = ({
  onSendMessage,
  onUploadPhoto,
  onSendVoice,
  isUploading,
  disabled = false,
}) => {
  const { language } = useLanguage();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [message]);

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    onSendMessage({
      content: message.trim(),
      type: "text",
    });
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }

    onUploadPhoto(file);
    setShowAttachmentMenu(false);
  };

  const handleRemovePreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "microphone" });
      return result.state === "granted";
    } catch {
      return true;
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) {
        toast.info(
          language === "am"
            ? "ማይክሮፎን ለመጠቀም ፍቃድ ያስፈልጋል"
            : "Microphone permission is needed for voice messages",
        );
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setAudioStream(stream);

      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/mp4";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/ogg;codecs=opus";
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: mimeType });

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);

        if (recordingTime < 1) {
          return;
        }

        try {
          const formData = new FormData();
          const extension = mimeType.includes("webm")
            ? "webm"
            : mimeType.includes("mp4")
              ? "m4a"
              : "ogg";
          formData.append("voice", audioBlob, `voice-message.${extension}`);
          formData.append("duration", recordingTime.toString());

          const response = await wantedApi.uploadVoiceMessage(formData);

          if (response?.url) {
            onSendMessage({
              content: response.url,
              type: "voice",
              metadata: {
                voiceUrl: response.url,
                voiceDuration: recordingTime,
              },
            });
          }
        } catch (err) {
          console.error("Failed to upload voice:", err);
          toast.error(
            language === "am"
              ? "የድምጽ መልእክት መላክ አልተሳካም"
              : "Failed to send voice message",
          );
        }
      };

      setMediaRecorder(recorder);
      recorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
      if (err.name === "NotAllowedError") {
        toast.error(
          language === "am"
            ? "ማይክሮፎን መድረስ አልተፈቀደም። እባክዎ ፍቃድ ይስጡ።"
            : "Microphone access denied. Please allow microphone access.",
        );
      } else {
        toast.error(
          language === "am" ? "ድምጽ መቅዳት አልተሳካም" : "Failed to start recording",
        );
      }
    }
  };

  const stopRecording = () => {
    clearInterval(recordingTimerRef.current);

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }

    setIsRecording(false);
    setMediaRecorder(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      {/* Image Preview */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-white dark:bg-charcoal rounded-xl border border-warm-gray/30 shadow-lg"
          >
            <div className="relative inline-block">
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-32 rounded-lg"
              />
              <button
                onClick={handleRemovePreview}
                className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full shadow-md hover:bg-error/90 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {isUploading && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
                <span className="text-xs text-stone">
                  {language === "am" ? "በመላክ ላይ..." : "Uploading..."}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-error/10 rounded-xl border border-error/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
              </span>
              <span className="text-sm font-medium text-error">
                {language === "am" ? "በመቅዳት ላይ..." : "Recording..."}{" "}
                {formatTime(recordingTime)}
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="px-3 py-1 bg-error text-white text-sm rounded-full hover:bg-error/90 transition-colors"
            >
              {language === "am" ? "አቁም" : "Stop"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment Menu */}
      <AnimatePresence>
        {showAttachmentMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 bg-white dark:bg-charcoal rounded-xl border border-warm-gray/30 shadow-lg overflow-hidden"
          >
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setShowAttachmentMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-cream transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center">
                <Image className="w-4 h-4 text-terracotta" />
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">
                  {language === "am" ? "ፎቶ" : "Photo"}
                </p>
                <p className="text-xs text-stone">
                  {language === "am" ? "ከጋለሪ ይምረጡ" : "Choose from gallery"}
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                startRecording();
                setShowAttachmentMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-cream transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-sahara/10 flex items-center justify-center">
                <Mic className="w-4 h-4 text-sahara" />
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">
                  {language === "am" ? "የድምጽ መልእክት" : "Voice Message"}
                </p>
                <p className="text-xs text-stone">
                  {language === "am" ? "ለመቅዳት ተጭነው ይያዙ" : "Hold to record"}
                </p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <button
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          disabled={disabled || isRecording}
          className="p-3 text-olive hover:text-terracotta transition-colors rounded-full hover:bg-warm-gray/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === "am" ? "መልእክት ይጻፉ..." : "Type a message..."
            }
            rows={1}
            disabled={disabled || isRecording}
            className="w-full px-4 py-3 pr-12 bg-white dark:bg-charcoal/20 border border-warm-gray rounded-2xl resize-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all disabled:opacity-50"
            style={{ maxHeight: "120px" }}
          />

          {/* Emoji Button */}
          <button
            className="absolute right-3 bottom-3 p-1 text-stone hover:text-terracotta transition-colors"
            disabled={disabled || isRecording}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send/Record Button */}
        {message.trim() ? (
          <button
            onClick={handleSend}
            disabled={disabled}
            className="p-3 bg-terracotta text-white rounded-full hover:bg-clay transition-all disabled:opacity-50 shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={disabled}
            className={`p-3 rounded-full transition-all shadow-sm ${
              isRecording
                ? "bg-error text-white"
                : "bg-olive text-white hover:bg-olive-dark"
            }`}
          >
            {isRecording ? (
              <StopCircle className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
