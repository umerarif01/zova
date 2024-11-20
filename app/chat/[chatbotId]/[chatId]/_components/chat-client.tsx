"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import type {
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { useChat } from "ai/react";
import { Switch } from "@/components/ui/switch";
import { Loader, Bot, SendHorizontal } from "lucide-react";
import Toggle from "./toggle";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSourceContext } from "./source-context";
import ContentViewer from "./content-viewer";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/drizzle/queries/select";

const PDFViewer = dynamic<{ pdfUrl: string }>(
  () => import("@/app/chat/[chatbotId]/[chatId]/_components/pdf-viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[90vh] flex items-center justify-center bg-gray-100">
        Loading PDF viewer...
      </div>
    ),
  }
);

interface DocumentClientProps {
  userImage?: string;
  chatbotId: string;
  chatId: string;
}

export default function DocumentClient({
  userImage,
  chatbotId,
  chatId,
}: DocumentClientProps) {
  const { currentSource } = useSourceContext();

  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});
  const [error, setError] = useState("");
  const [chatOnlyView, setChatOnlyView] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { data, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const messages = await getMessages(chatId);
      return messages.map((msg) => ({
        ...msg,
        role: msg.role as "user" | "system",
      }));
    },
  });

  const {
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    messages,
    isLoading,
  } = useChat({
    api: "/api/chat",
    body: { chatId, chatbotId },
    initialMessages: data || [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentMessage = input.trim();
    if (!currentMessage) return;

    // Call original submit handler
    await originalHandleSubmit(e);
  };

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Check scroll position and show/hide scroll button
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

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && messages) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const defaultProfileIcon = "/user-icon.webp";

  return (
    <div className="mx-auto flex flex-col no-scrollbar -mt-2">
      <Toggle chatOnlyView={chatOnlyView} setChatOnlyView={setChatOnlyView} />

      <div className="flex justify-between w-full lg:flex-row flex-col sm:space-y-20 lg:space-y-0 p-2">
        {/* Content Viewer */}
        {!chatOnlyView &&
          (currentSource ? (
            <ContentViewer source={currentSource} />
          ) : (
            <div className="w-full h-[90vh] flex items-center justify-center bg-gray-100">
              Select a source to view content
            </div>
          ))}

        {/* Chat Interface */}
        <Card className="w-full h-[90vh] max-w-4xl">
          <CardContent className="p-6 flex flex-col h-full">
            <ScrollArea
              ref={messageListRef}
              className="flex-grow pr-4 overflow-y-auto"
            >
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-xl text-gray-500">
                  <p>Ask your first question below!</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={`chatMessage-${index}`}
                    className={`mb-4 ${
                      message.role === "user" ? "ml-12" : "mr-12"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-3 ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      {message.role === "user" ? (
                        <Avatar>
                          <AvatarImage
                            src={userImage || defaultProfileIcon}
                            alt="User"
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar>
                          <AvatarFallback>
                            <Bot className="w-6 h-6 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-purple-500 text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                                {...props}
                              />
                            ),
                          }}
                          className="prose max-w-none dark:prose-invert"
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </ScrollArea>

            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-20 right-8 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            )}

            {/* Input Area */}
            <div className="flex justify-center items-center sm:h-[15vh] h-[20vh]">
              <form
                onSubmit={handleSubmit}
                className="relative w-full px-4 sm:pt-10 pt-2"
              >
                <textarea
                  className="resize-none p-4 pr-12 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm transition-all duration-200"
                  disabled={isLoading}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleEnter}
                  ref={textAreaRef}
                  rows={3}
                  maxLength={512}
                  id="userInput"
                  name="userInput"
                  placeholder={
                    isLoading ? "Waiting for response..." : "Ask me anything..."
                  }
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute top-[40px] sm:top-[71px] right-6 text-gray-600 hover:text-gray-900 bg-transparent p-2 rounded-full transition-colors duration-200"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <SendHorizontal className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>

            {error && (
              <div className="mx-4 p-4 border border-red-400 rounded-lg bg-red-50">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
