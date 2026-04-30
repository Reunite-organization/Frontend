import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Bot,
  User,
  Share2,
  Phone,
  MessageSquare,
  WheatIcon,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import speechService from "@/services/speechService";
import api from "@/services/api";

const AIAssistant = ({ caseData, userLocation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your AI assistant for missing person coordination. I can help with case updates, volunteer coordination, and broadcasting information. How can I assist you today?",
      timestamp: new Date(),
      language: "en",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text = inputText, voiceInput = false) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: text,
      timestamp: new Date(),
      language: currentLanguage,
      voiceInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Call AI service
      const response = await api.post("/ai/assistant", {
        message: text,
        language: currentLanguage,
        context: {
          caseData,
          userLocation,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
        },
      });

      const aiResponse = response.data.data;

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse.text,
        timestamp: new Date(),
        language: aiResponse.language,
        actions: aiResponse.actions || [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Auto-speak if voice was used for input
      if (voiceInput && aiResponse.text) {
        speakResponse(aiResponse.text, aiResponse.language);
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        language: currentLanguage,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const languageLocaleMap = {
    en: "en-US",
    am: "am-ET",
    orm: "om-ET",
    tir: "ti-ET",
    so: "so-SO",
  };

  const getLocale = (lang) => languageLocaleMap[lang] || "en-US";

  const startVoiceInput = () => {
    if (!speechService.isSupported()) {
      toast.error("Voice input is not supported in your browser");
      return;
    }

    setIsListening(true);
    speechService.setLanguage(getLocale(currentLanguage));

    speechService.startListening(
      (transcript) => {
        setInputText(transcript);
        handleSendMessage(transcript, true);
        setIsListening(false);
      },
      (error) => {
        console.error("Voice recognition error:", error);
        setIsListening(false);
        toast.error("Voice recognition failed. Please try again.");
      },
      () => {
        console.log("Voice recognition started");
      },
      () => {
        setIsListening(false);
      },
    );
  };

  const stopVoiceInput = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const speakResponse = (text, language) => {
    if (!speechService.isSupported()) return;

    setIsSpeaking(true);
    speechService.speak(text, getLocale(language || currentLanguage), () => {
      setIsSpeaking(false);
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      const lastAiMessage = messages.filter((m) => m.type === "ai").pop();
      if (lastAiMessage) {
        speakResponse(lastAiMessage.content, lastAiMessage.language);
      }
    }
  };

  const handleBroadcast = async (platform, message) => {
    try {
      await api.post("/ai/broadcast", {
        platform,
        message,
        caseId: caseData?.caseId,
        language: currentLanguage,
      });

      toast.success(`Message broadcasted to ${platform}`);
    } catch (error) {
      console.error("Broadcast error:", error);
      toast.error(`Failed to broadcast to ${platform}`);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "telegram":
        return <MessageSquare className="w-4 h-4" />;
      case "whatsapp":
        return <Phone className="w-4 h-4" />;
      case "facebook":
        return <WheatIcon className="w-4 h-4" />;
      case "sms":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-[1000]">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
          size="lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[1000] w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
                <option value="orm">Oromo</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.type === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.voiceInput && (
                        <Mic className="w-3 h-3 opacity-70" />
                      )}
                    </div>
                    <p className="text-sm">{message.content}</p>

                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleBroadcast(action.platform, action.message)
                            }
                            className="text-xs"
                          >
                            {getPlatformIcon(action.platform)}
                            <span className="ml-1">{action.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  currentLanguage === "en"
                    ? "Type your message..."
                    : "መልክዎን ይፃፉ..."
                }
                className="flex-1 min-h-[60px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isTyping}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>

                <Button
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  variant={isListening ? "destructive" : "outline"}
                  size="sm"
                  disabled={isTyping}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  onClick={toggleSpeech}
                  variant={isSpeaking ? "default" : "outline"}
                  size="sm"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
