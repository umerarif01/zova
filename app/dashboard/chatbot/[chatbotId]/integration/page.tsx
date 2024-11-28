import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import CopyButton from "./_components/copy-button";

export default async function IntegrationPage(props: {
  params: Promise<{ chatbotId: string }>;
}) {
  const params = await props.params;

  const chatbotId = params.chatbotId;

  const embedCode = `<script>
window.chatbotId = "${chatbotId}";
window.zovaUrl = "${process.env.AUTH_URL}";
</script>
<script src="${process.env.AUTH_URL}embed.js" defer></script>`;

  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Integration
        </h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Script Tag Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground text-sm">
            To integrate the chatbot into your website, follow these steps:
          </p>
          <ol className="list-decimal list-inside mb-4 text-muted-foreground text-sm">
            <li>Copy the script tag below.</li>
            <li>
              Paste it into the HTML of your website, preferably within the
              &lt;head&gt; tag.
            </li>
            <li>
              The chatbot will automatically initialize with the current
              configuration.
            </li>
          </ol>
          <Textarea
            value={embedCode}
            readOnly
            className="h-40 font-mono text-sm"
          />
          <CopyButton embedCode={embedCode} />
          <p className="mt-4 text-muted-foreground text-sm">
            {`Note: You can customize the chatbot's appearance and behavior by
            modifying the configuration on the chatbot settings page.`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
