"use client";

import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import {
  Banknote,
  ChartNoAxesCombined,
  Folder,
  HomeIcon,
  Settings,
  MessageSquare,
  Brain,
  BarChart3,
  UserCircle,
  ArrowLeft,
  Plug,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/zova-logo.png";
import SidebarUsageComponent from "./sidebar-usage";
import { useSession } from "next-auth/react";

export default function DashboardSideBar() {
  const pathname = usePathname();
  const session = useSession();

  const isChatbotRoute = pathname.startsWith("/dashboard/chatbot");

  const renderSidebarContent = () => {
    if (isChatbotRoute) {
      const chatbotId = pathname.split("/")[3]; // Extract chatbotId from the URL

      return (
        <nav className="grid items-start px-4 text-sm font-medium">
          <Link
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-muted dark:text-gray-50 dark:hover:text-gray-50":
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
          <Separator className="my-2" />
          <Link
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-muted dark:text-gray-50 dark:hover:text-gray-50":
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
          <Link
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-muted dark:text-gray-50 dark:hover:text-gray-50":
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
          <Link
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-muted dark:text-gray-50 dark:hover:text-gray-50":
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
          <Link
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-muted dark:text-gray-50 dark:hover:text-gray-50":
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
          <Link
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-muted dark:text-gray-50 dark:hover:text-gray-50":
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
        </nav>
      );
    }

    // Existing dashboard sidebar content
    return (
      <nav className="grid items-start px-4 text-sm font-medium">
        <Link
          className={clsx(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
            {
              "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-muted dark:text-gray-50 dark:hover:text-gray-50":
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

        <Separator className="my-3" />
        <Link
          className={clsx(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
            {
              "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-muted dark:text-gray-50 dark:hover:text-gray-50":
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
      </nav>
    );
  };

  return (
    <div className="lg:block hidden border-r h-full">
      <div className="flex h-full max-h-screen flex-col gap-2 ">
        <div className="flex h-[55px] items-center justify-between border-b px-3 w-full">
          <Link
            className="flex items-center gap-2 font-semibold ml-1 "
            href="/"
          >
            <Image
              src={Logo}
              alt="Zova Logo"
              width={100}
              height={100}
              priority
              className="h-8 w-8"
            />
            <span className="text-sm">zova.chat</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2 ">
          {renderSidebarContent()}
        </div>
        <SidebarUsageComponent userId={session.data?.user.id || ""} />{" "}
      </div>
    </div>
  );
}
