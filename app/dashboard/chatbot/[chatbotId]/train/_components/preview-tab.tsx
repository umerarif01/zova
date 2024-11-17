import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatbotConfig } from "./chatbot-integration";
import { MessageCircle, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";

type Message = {
  content: string;
  sender: "user" | "bot";
};

type PreviewTabProps = {
  config: ChatbotConfig;
};

export default function PreviewTab({ config }: PreviewTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    { content: config.welcomeMessage, sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newMessages = [
      ...messages,
      { content: inputMessage, sender: "user" as const },
    ];
    setMessages(newMessages);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          content: `You said: "${inputMessage}". How can I help with that?`,
          sender: "bot",
        },
      ]);
    }, 1000);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const ChatbotContent = () => (
    <div
      className={`h-full flex flex-col ${
        isOpen ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <div className="p-3 bg-primary text-primary-foreground font-bold flex justify-between items-center">
        <span>{config.botName}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:text-primary-foreground/90"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="flex-grow p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="p-3 bg-muted">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow"
            ref={inputRef}
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );

  const ChatWidget = () => (
    <Button
      size="icon"
      className={`rounded-full shadow-lg bg-primary text-primary-foreground transition-all duration-300 ${
        isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
      }`}
      onClick={() => setIsOpen(true)}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Open chat</span>
    </Button>
  );

  return (
    <div
      className={`flex justify-center items-center h-screen bg-purple-400 rounded-lg p-8`}
    >
      <Tabs defaultValue="desktop" className="w-full max-w-[1024px]">
        <TabsList className="mb-4 mx-auto">
          <TabsTrigger value="desktop" className="hidden sm:inline-flex">
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>
        <TabsContent value="desktop" className="hidden sm:block">
          <div
            className={`w-[1024px] h-[640px] ${
              theme === "dark" ? "bg-gray-700" : "bg-white"
            } rounded-[20px] shadow-2xl overflow-hidden border-[14px] ${
              theme === "dark" ? "border-gray-900" : "border-gray-800"
            } relative`}
          >
            <div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-1/4 h-[20px] ${
                theme === "dark" ? "bg-gray-900" : "bg-gray-800"
              } rounded-b-[10px]`}
            ></div>
            <div
              className={`w-full h-full ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              } p-4 flex justify-end items-end`}
            >
              {isOpen ? (
                <div
                  className={`w-[360px] h-[480px] ${
                    theme === "dark" ? "bg-gray-700" : "bg-white"
                  } rounded-[20px] shadow-lg overflow-hidden relative`}
                >
                  <ChatbotContent />
                </div>
              ) : (
                <div className="absolute bottom-4 right-4">
                  <ChatWidget />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="mobile" className="flex justify-center">
          <div
            className={`w-[360px] h-[640px] ${
              theme === "dark" ? "bg-gray-700" : "bg-white"
            } rounded-[40px] shadow-2xl overflow-hidden relative border-[14px] ${
              theme === "dark" ? "border-gray-900" : "border-gray-800"
            }`}
          >
            <div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-[24px] ${
                theme === "dark" ? "bg-gray-900" : "bg-gray-800"
              } rounded-b-[16px]`}
            ></div>
            <div
              className={`w-full h-full ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              } relative`}
            >
              {isOpen ? (
                <ChatbotContent />
              ) : (
                <div className="absolute bottom-4 right-4">
                  <ChatWidget />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
