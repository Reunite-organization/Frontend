import React from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import VideoCallButton from "./VideoCallButton";

const ChatWindow = () => {
  return (
    <div className="flex-1 flex flex-col">
      <header className="p-4 border-b flex justify-between items-center">
        <h4 className="font-bold">Jane Smith</h4>
        <VideoCallButton />
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageBubble sender="other" message="Hi! Is your dog still lost?" />
        <MessageBubble sender="me" message="Yes! Did you see him?" />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
