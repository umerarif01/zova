"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSourceContext } from "./source-context";
import type { Source } from "./source-context";
import KbSourcesCombobox from "./kb-sources-combobox";

interface HeaderProps {
  chatbotId: string;
  sources: Source[];
}

export default function Header({ sources, chatbotId }: HeaderProps) {
  const { setCurrentSource } = useSourceContext();

  const handleSourceSelect = (source: Source) => {
    console.log("Selected source:", source); // Debug log
    setCurrentSource(source);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center space-x-4">
            <Link
              href={`/dashboard/chatbot/${chatbotId}`}
              className="flex items-center space-x-2 hover:opacity-80"
            >
              <Logo />
            </Link>
            <div className="hidden sm:block">
              <KbSourcesCombobox
                sources={sources}
                onSourceSelect={handleSourceSelect}
              />
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="hidden sm:inline-block font-medium text-slate-700 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <KbSourcesCombobox
                    sources={sources}
                    onSourceSelect={handleSourceSelect}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Image
        src="/zova-logo.png"
        alt="Zova Logo"
        width={35}
        height={35}
        className="h-8 w-8"
      />
      <span className="hidden font-semibold sm:inline-block">zova.chat</span>
    </div>
  );
}
