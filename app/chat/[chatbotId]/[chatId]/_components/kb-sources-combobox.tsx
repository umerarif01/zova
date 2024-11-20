"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Source } from "./source-context";

interface KbSourcesComboboxProps {
  sources: Source[];
  onSourceSelect: (source: Source) => void;
}

export default function KbSourcesCombobox({
  sources,
  onSourceSelect,
}: KbSourcesComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(
    sources[0]?.id || ""
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedValue
            ? sources
                .find((source) => source.id === selectedValue)
                ?.name?.slice(0, 20) +
              (sources.find((source) => source.id === selectedValue)?.name
                ?.length ?? 0 > 20
                ? "..."
                : "")
            : "Select source..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search sources..." />
          <CommandList>
            <CommandEmpty>No sources found.</CommandEmpty>
            <CommandGroup>
              {sources.map((source) => (
                <CommandItem
                  key={source.id}
                  value={source.id}
                  onSelect={() => {
                    setSelectedValue(source.id);
                    onSourceSelect(source);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === source.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {source.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
