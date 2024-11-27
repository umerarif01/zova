"use client";

import { useRef, useState, useEffect } from "react";
import { SendIcon, User, XIcon, Bot, ChevronDown } from "lucide-react";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";

interface ChatbotWindowProps {
  embedded?: boolean;
  chatbotId?: string;
  name?: string;
  welcomeMessage?: string;
  background?: string;
  textColor?: string;
}

export function ChatbotWindow({
  embedded = false,
  chatbotId,
  name,
  welcomeMessage,
  background = "#3b82f6",
  textColor = "#ffffff",
}: ChatbotWindowProps) {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
  } = useChat({
    api: "/api/chat",
    body: { chatbotId },
    initialMessages: data || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await originalHandleSubmit(e);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const scrollArea = messageListRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const isAtBottom =
        Math.abs(
          scrollArea.scrollHeight -
            scrollArea.scrollTop -
            scrollArea.clientHeight
        ) < 50;
      setShowScrollButton(!isAtBottom);
    };

    scrollArea.addEventListener("scroll", handleScroll);
    return () => scrollArea.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col h-full shadow-lg overflow-hidden rounded-lg bg-white">
      <div
        className="flex flex-row items-center justify-between py-3 px-4 text-white"
        style={{ backgroundColor: background, color: "#FFFFFF" }}
      >
        <h2 className="text-lg font-semibold">{name}</h2>
        {embedded && (
          <button
            className="hover:opacity-80 rounded-full p-1 transition-colors"
            style={{ color: "#FFFFFF" }}
            onClick={() => window.parent.postMessage("close-chat", "*")}
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div ref={messageListRef} className="h-full overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {welcomeMessage}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } ${message.role === "user" ? "ml-12" : "mr-12"}`}
                >
                  {message.role === "user" ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: background, color: textColor }}
                    >
                      <User className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.role === "user" ? "" : "bg-gray-200 text-gray-800"
                    }`}
                    style={
                      message.role === "user"
                        ? { backgroundColor: background, color: textColor }
                        : {}
                    }
                  >
                    {message.role === "user" ? (
                      message.content
                    ) : (
                      <ReactMarkdown className="prose prose-sm max-w-none">
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showScrollButton && (
        <button
          className="absolute bottom-20 right-4 rounded-full p-2 shadow-lg hover:opacity-80 transition-colors"
          style={{ backgroundColor: background, color: textColor }}
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      )}

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": background } as any}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: background, color: "#FFFFFF" }}
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
      <div className="text-center py-2 text-sm text-gray-500">
        ⚡Powered by{" "}
        <a
          href="https://zova.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: background }}
          className="hover:underline"
        >
          zova.chat
        </a>
      </div>
    </div>
  );
}
