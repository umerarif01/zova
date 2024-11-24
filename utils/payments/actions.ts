"use server";

import { getUserSubscriptionByUserId } from "@/drizzle/queries/select";
import { auth } from "../auth";
import { createCustomerPortalSession } from "./stripe";
import { redirect } from "next/navigation";

export async function customerPortalAction() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const userSubscription = await getUserSubscriptionByUserId(session.user.id);

  if (!userSubscription) {
    throw new Error("No subscription found");
  }

  const portalSession = await createCustomerPortalSession(userSubscription);
  redirect(portalSession.url);
}
