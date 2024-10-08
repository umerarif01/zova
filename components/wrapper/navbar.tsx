"use client";
import Link from "next/link";
import * as React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "../ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { UserProfile } from "../user-profile";
import ModeToggle from "../mode-toggle";
import { BlocksIcon, LayoutDashboard, LogIn } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import config from "@/config";
import Image from "next/image";

import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import { cn } from "@/utils/cn";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const session = useSession();

  return (
    <div className="flex min-w-full fixed justify-between p-2 border-b z-100 dark:bg-black dark:bg-opacity-50 bg-white">
      <div className="flex justify-between w-full min-[825px]:hidden">
        <Dialog>
          <SheetTrigger className="p-2 transition">
            <Button
              size="icon"
              variant="ghost"
              className="w-4 h-4"
              aria-label="Open menu"
              asChild
            >
              <GiHamburgerMenu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Zova.chat</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem]">
              <DialogClose asChild>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Home
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link
                  href="/dashboard"
                  legacyBehavior
                  passHref
                  className="cursor-pointer"
                >
                  <Button variant="outline">Dashboard</Button>
                </Link>
              </DialogClose>
            </div>
          </SheetContent>
        </Dialog>
        <ModeToggle />
      </div>
      <NavigationMenu>
        <NavigationMenuList className="max-[825px]:hidden flex gap-3 w-[100%] justify-between">
          <Link href="/" className="pl-2 flex items-center" aria-label="Home">
            <Image
              src="/zova-logo.png"
              alt="Zova Logo"
              width={35}
              height={35}
              className=""
            />
            <span className="sr-only">Home</span>
          </Link>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2 max-[825px]:hidden">
        {session.data?.user ? (
          <Link href="/dashboard" legacyBehavior passHref>
            <Button size="sm" variant="outline" className="text-sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/sign-in" legacyBehavior passHref>
            <Button size="sm" variant="outline" className="text-sm">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
