"use client";

import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { Banknote, Folder, HomeIcon, Settings, Users } from "lucide-react"; // Import Users icon
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTasks } from "react-icons/fa";

export default function DashboardSideBar() {
  const pathname = usePathname();

  return (
    <div className="lg:block hidden border-r h-full">
      <div className="flex h-full max-h-screen flex-col gap-2 ">
        <div className="flex h-[55px] items-center justify-between border-b px-3 w-full">
          <Link className="flex items-center gap-2 font-semibold ml-1" href="/">
            <Image
              src="/zova-logo.png"
              alt="logo"
              width={30}
              height={15}
              priority={true}
              className="block rounded-[inherit] object-contain"
            />
            <span>zova.chat</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2 ">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                {
                  "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                    pathname === "/admin",
                }
              )}
              href="/admin"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <HomeIcon className="h-3 w-3" />
              </div>
              Home
            </Link>

            <Link
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                {
                  "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50":
                    pathname === "/admin/users",
                }
              )}
              href="/admin/users"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Users className="h-3 w-3" />
              </div>
              Users
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
