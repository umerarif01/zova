import DocumentClient from "./_components/chat-client";
import Header from "./_components/header";
import { auth } from "@/utils/auth";
import UserIcon from "@/public/user-icon.webp";
import { getKbSources } from "@/drizzle/queries/select";
import type { Source } from "./_components/source-context";
import { SourceProvider } from "./_components/source-context";

export default async function Page(props: {
  params: Promise<{ chatId: string; chatbotId: string }>;
}) {
  const params = await props.params;
  const session = await auth();
  const sources = await getKbSources(params.chatbotId);

  if (!sources || sources.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No sources available for this chatbot</p>
      </div>
    );
  }

  const userImage = session?.user?.image || UserIcon.src;

  return (
    <SourceProvider initialSource={sources[0]}>
      <div>
        <Header sources={sources} />
        <DocumentClient
          userImage={userImage}
          chatbotId={params.chatbotId}
          chatId={params.chatId}
        />
      </div>
    </SourceProvider>
  );
}
