import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Copy } from "lucide-react";
import { ChatbotConfig } from "./chatbot-integration";
import { toast } from "sonner";

type IntegrationTabProps = {
  config: ChatbotConfig;
  setConfig: React.Dispatch<React.SetStateAction<ChatbotConfig>>;
};

export default function IntegrationTab({
  config,
  setConfig,
}: IntegrationTabProps) {
  const generateScriptTag = () => {
    return `const iframe = document.createElement("iframe");
    
    const iframeStyles = (styleString) => {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
    }
    
    iframeStyles('
        .chat-frame {
            position: fixed;
            bottom: 50px;
            right: 50px;
            border: none;
        }
    ')
    
    iframe.src = "http://localhost:3000/chatbot"
    iframe.classList.add('chat-frame')
    document.body.appendChild(iframe)
    
    window.addEventListener("message", (e) => {
        if(e.origin !== "http://localhost:3000") return null
        let dimensions = JSON.parse(e.data)
        iframe.width = dimensions.width
        iframe.height = dimensions.height
        iframe.contentWindow.postMessage("{id}", "http://localhost:3000/")
    })`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Website Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground text-sm">
            To integrate the chatbot into your website, follow these steps:
          </p>
          <ol className="list-decimal list-inside mb-4 text-muted-foreground text-sm">
            <li>Copy the iframe code below.</li>
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
            value={generateScriptTag()}
            readOnly
            className="h-40 font-mono text-sm"
          />
          <Button
            className="mt-2"
            onClick={() => {
              navigator.clipboard.writeText(generateScriptTag());
              toast("Copied to clipboard");
            }}
            variant={"custom"}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
          </Button>
          <p className="mt-4 text-muted-foreground text-sm">
            {`Note: You can customize the chatbot's appearance and behavior by
            modifying the configuration in the accordion below.`}
          </p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full mt-6">
        <AccordionItem value="configuration">
          <AccordionTrigger>Configuration</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="botName">Bot Name</Label>
                <Input
                  id="botName"
                  value={config.botName}
                  onChange={(e) =>
                    setConfig({ ...config, botName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Input
                  id="welcomeMessage"
                  value={config.welcomeMessage}
                  onChange={(e) =>
                    setConfig({ ...config, welcomeMessage: e.target.value })
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="customization">
          <AccordionTrigger>Customization</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  type="color"
                  id="primaryColor"
                  value={config.primaryColor}
                  onChange={(e) =>
                    setConfig({ ...config, primaryColor: e.target.value })
                  }
                  className="w-full h-10"
                />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  type="color"
                  id="secondaryColor"
                  value={config.secondaryColor}
                  onChange={(e) =>
                    setConfig({ ...config, secondaryColor: e.target.value })
                  }
                  className="w-full h-10"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
