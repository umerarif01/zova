"use client";

import { useRef, useState, useEffect } from "react";
import { SendIcon, User, XIcon, Bot, ChevronDown } from "lucide-react";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/drizzle/queries/select";
import { createConversationWithoutUserId } from "@/drizzle/queries/insert";

interface ChatbotWindowProps {
  embedded?: boolean;
  chatbotId?: string;
  name?: string;
  welcomeMessage?: string;
  background?: string;
  textColor?: string;
}

// Message component
const Message = ({
  message,
  background,
}: {
  message: any;
  background: string;
}) => (
  <div
    className={`flex items-start gap-3 ${
      message.role === "user" ? "flex-row-reverse ml-12" : "flex-row mr-12"
    }`}
  >
    {message.role === "user" ? (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: background, color: "white" }}
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
          ? { backgroundColor: background, color: "white" }
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
);

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-start">
    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  </div>
);

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
  const [chatId, setChatId] = useState("");

  const { data: initialMessages } = useQuery({
    queryKey: ["chat", chatbotId],
    queryFn: async () => {
      const messages: any[] = [];
      return messages.map((msg) => ({
        ...msg,
        role: msg.role as "user" | "system",
      }));
    },
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
  } = useChat({
    api: "/api/chat",
    body: { chatbotId, chatId },
    initialMessages: initialMessages || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatbotId) return;

    if (!chatId) {
      const result = await createConversationWithoutUserId(chatbotId);
      if (result?.success && result.id) {
        setChatId(result.id);
        // Call originalHandleSubmit with updated chatId
        await originalHandleSubmit(e, {
          body: { chatbotId, chatId: result.id },
        });
        return;
      }
    }

    await originalHandleSubmit(e, {
      body: { chatbotId, chatId },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  useEffect(() => {
    const scrollToBottom = () => {
      messageListRef.current?.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    };
    scrollToBottom();
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
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
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
                <Message
                  key={index}
                  message={message}
                  background={background}
                />
              ))
            )}
            {isLoading && <LoadingIndicator />}
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
