import BotConfiguration from "./_components/bot-configuration";
import AdvancedActions from "./_components/advanced-actions";
import { getChatbotById } from "@/drizzle/queries/select";

export default async function SettingsPage(props: {
  params: Promise<{ chatbotId: string }>;
}) {
  const params = await props.params;

  const chatbotId = params.chatbotId;

  if (!chatbotId) return;

  const chatbot = await getChatbotById(chatbotId);

  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full max-w-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Chatbot Settings
        </h2>
      </div>
      <BotConfiguration chatbot={chatbot[0]} />
      <AdvancedActions />
    </div>
  );
}
