"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import config from "@/config";
import { useSession } from "next-auth/react";
import UserProfileCard from "../_components/user-profile-card";
import SubscriptionCard from "../_components/subscription-card";

export default function Settings() {
  const session = useSession();

  return (
    <div className="flex justify-start items-center flex-wrap px-4 pt-5 gap-4">
      <div className="flex flex-col gap-3 mb-[5rem] w-full max-w-[1000px]">
        <h2 className="mt-8 scroll-m-20 border-b pb-2 w-full text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          General Settings
        </h2>
        <div className=" flex flex-col gap-5">
          <SubscriptionCard />
          <UserProfileCard session={session} />
        </div>
      </div>
    </div>
  );
}
