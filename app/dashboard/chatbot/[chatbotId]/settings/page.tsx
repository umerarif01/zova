import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Chatbot Settings
        </h2>
        <Button
          variant="outline"
          className="mt-4 sm:mt-0 flex items-center"
          size={"sm"}
        >
          <SaveIcon className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
      {/* Add main content here */}
    </div>
  );
}
