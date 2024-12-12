import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";

export function AccordionComponent() {
  return (
    <div className="flex flex-col w-[70%] lg:w-[50%]">
      <h2
        className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold text-center tracking-tight dark:text-white text-gray-900`}
      >
        Frequently Asked Questions (FAQs)
      </h2>
      <Accordion type="single" collapsible className="w-full mt-2">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <span className="font-medium">
              {"What makes this chatbot different from others?"}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              {
                "Our chatbot offers instant responses, robust analytics, multilingual support, and full customization, making it adaptable to your unique needs."
              }
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <span className="font-medium">
              {"Can I customize the chatbot's appearance?"}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              {
                "Yes, the chatbot is fully customizable with options to personalize the branding, colors, and design elements to fit your brand's style."
              }
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <span className="font-medium">
              {"Is my data secure with this chatbot?"}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              {
                "Absolutely. We implement industry-leading security standards to ensure your data remains private and protected."
              }
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>
            <span className="font-medium">
              {"How do I access the chat logs?"}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              {
                "Chat logs are easily accessible through the dashboard, where you can review past interactions and monitor the chatbot's performance."
              }
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            <span className="font-medium">
              {"What kind of analytics are available?"}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              {
                "Our platform provides detailed analytics, which includes the total number of responses, the number of conversations, and the number of tokens used."
              }
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
