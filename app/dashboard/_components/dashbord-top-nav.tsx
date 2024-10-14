"use client";

import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserProfile } from "@/components/user-profile";
import config from "@/config";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Banknote,
  ChartNoAxesCombined,
  Folder,
  HomeIcon,
  Settings,
  MessageSquare,
  Brain,
  BarChart3,
  ArrowLeft,
  Plug,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import Logo from "@/public/zova-logo.png";

export default function DashboardTopNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChatbotRoute = pathname.startsWith("/dashboard/chatbot");

  const renderSidebarContent = () => {
    if (isChatbotRoute) {
      const chatbotId = pathname.split("/")[3];

      return (
        <nav className="grid items-start px-4 text-sm font-medium">
          <DialogClose asChild>
            <Link
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                {
                  "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                    pathname === "/dashboard",
                }
              )}
              href="/dashboard"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ArrowLeft className="h-3 w-3" />
              </div>
              Back to dashboard
            </Link>
          </DialogClose>
          <Separator className="my-2" />
          <DialogClose asChild>
            <Link
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                {
                  "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                    pathname === `/dashboard/chatbot/${chatbotId}`,
                }
              )}
              href={`/dashboard/chatbot/${chatbotId}`}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <MessageSquare className="h-3 w-3" />
              </div>
              Chats
            </Link>
          </DialogClose>
          <DialogClose asChild>
            <Link
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                {
                  "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                    pathname === `/dashboard/chatbot/${chatbotId}/train`,
                }
              )}
              href={`/dashboard/chatbot/${chatbotId}/train`}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Brain className="h-3 w-3" />
              </div>
              Train
            </Link>
          </DialogClose>
          <DialogClose asChild>
            <Link
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                {
                  "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                    pathname === `/dashboard/chatbot/${chatbotId}/analytics`,
                }
              )}
              href={`/dashboard/chatbot/${chatbotId}/analytics`}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <BarChart3 className="h-3 w-3" />
              </div>
              Analytics
            </Link>
          </DialogClose>
          <DialogClose asChild>
            <Link
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                {
                  "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                    pathname === `/dashboard/chatbot/${chatbotId}/integration`,
                }
              )}
              href={`/dashboard/chatbot/${chatbotId}/integration`}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Plug className="h-3 w-3" />
              </div>
              Integration
            </Link>
          </DialogClose>
          <DialogClose asChild>
            <Link
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                {
                  "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                    pathname === `/dashboard/chatbot/${chatbotId}/settings`,
                }
              )}
              href={`/dashboard/chatbot/${chatbotId}/settings`}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-3 w-3" />
              </div>
              Settings
            </Link>
          </DialogClose>
        </nav>
      );
    }

    return (
      <nav className="grid items-start px-4 text-sm font-medium">
        <DialogClose asChild>
          <Link
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                  pathname === "/dashboard",
              }
            )}
            href="/dashboard"
          >
            <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
              <HomeIcon className="h-3 w-3" />
            </div>
            Home
          </Link>
        </DialogClose>
        <DialogClose asChild>
          <Link
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                  pathname === "/dashboard/analytics",
              }
            )}
            href="/dashboard/analytics"
          >
            <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
              <ChartNoAxesCombined className="h-3 w-3" />
            </div>
            Analytics
          </Link>
        </DialogClose>
        <Separator className="my-3" />
        <DialogClose asChild>
          <Link
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                  pathname === "/dashboard/settings",
              }
            )}
            href="/dashboard/settings"
            id="onboarding"
          >
            <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
              <Settings className="h-3 w-3" />
            </div>
            Settings
          </Link>
        </DialogClose>
      </nav>
    );
  };

  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[55px] items-center gap-4 border-b px-3">
        <Dialog>
          <SheetTrigger className="min-[1024px]:hidden p-2 transition">
            <HamburgerMenuIcon />
            <Link href="/dashboard">
              <span className="sr-only">Home</span>
            </Link>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold ml-1 dark:bg-black p-1 rounded-lg"
              >
                <Image
                  src={Logo}
                  alt="Zova Logo"
                  width={100}
                  height={100}
                  priority
                  className="h-8 w-8"
                />
                <SheetTitle>Zova.chat</SheetTitle>
              </Link>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem]">
              {renderSidebarContent()}
            </div>
          </SheetContent>
        </Dialog>
        <div className="flex justify-center items-center gap-2 ml-auto">
          <UserProfile />
          <ModeToggle />
        </div>
      </header>
      {children}
    </div>
  );
}
