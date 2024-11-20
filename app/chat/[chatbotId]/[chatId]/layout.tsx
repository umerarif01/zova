import { SourceProvider } from "./_components/source-context";

interface ChatLayoutProps {
  children: React.ReactNode;
  initialSource?: any;
}

export default function ChatLayout({
  children,
  initialSource,
}: ChatLayoutProps) {
  return (
    <SourceProvider initialSource={initialSource}>{children}</SourceProvider>
  );
}
