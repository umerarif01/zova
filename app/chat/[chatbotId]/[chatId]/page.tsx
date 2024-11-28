import DocumentClient from "./_components/chat-client";
import Header from "./_components/header";
import { auth } from "@/utils/auth";
import UserIcon from "@/public/user-icon.webp";
import { getKbSources } from "@/drizzle/queries/select";
import type { Source } from "./_components/source-context";
import { SourceProvider } from "./_components/source-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default async function Page(props: {
  params: Promise<{ chatId: string; chatbotId: string }>;
}) {
  const params = await props.params;
  const session = await auth();
  const sources = await getKbSources(params.chatbotId);

  if (!sources || sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500">No sources available for this chatbot</p>
        <Link href={`/dashboard/chatbot/${params.chatbotId}/train`}>
          <Button className="mt-4" variant={"outline"}>
            <PlusIcon className="w-4 h-4 mr-2" /> Add Knowledge Sources
          </Button>
        </Link>
      </div>
    );
  }

  const userImage = session?.user?.image || UserIcon.src;

  return (
    <SourceProvider initialSource={sources[0]}>
      <div>
        <Header sources={sources} chatbotId={params.chatbotId} />
        <DocumentClient
          userId={session?.user.id || ""}
          userImage={userImage}
          chatbotId={params.chatbotId}
          chatId={params.chatId}
        />
      </div>
    </SourceProvider>
  );
}
