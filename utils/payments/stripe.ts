import {
  insertRecentSubscription,
  insertUserSubscription,
} from "@/drizzle/queries/insert";
import {
  getUserSubscriptionByStripeCustomerId,
  getUserSubscriptionByUserId,
} from "@/drizzle/queries/select";
import { updateUserSubscription } from "@/drizzle/queries/update";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { DrizzleSubscription } from "@/drizzle/schema";
import { auth } from "../auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  userId: string
) {
  const customerId = session.customer as string;
  const subscription = session.subscription as string;

  const userSubscription = await getUserSubscriptionByStripeCustomerId(
    customerId
  );

  const stripeSubscription = await stripe.subscriptions.retrieve(subscription);
  const product = await stripe.products.retrieve(
    stripeSubscription.items.data[0]?.price.product as string
  );

  await insertRecentSubscription({
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription,
    stripeProductId: product.id,
    planName: product.name,
  });

  if (!userSubscription) {
    await insertUserSubscription({
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription,
      stripeProductId: product.id,
      planName: product.name,
      subscriptionStatus: stripeSubscription.status,
    });
    return;
  }

  await updateUserSubscription(userSubscription.id, {
    stripeSubscriptionId: subscription,
    stripeProductId: product.id,
    planName: product.name,
    subscriptionStatus: stripeSubscription.status,
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const userSubscription = await getUserSubscriptionByStripeCustomerId(
    customerId
  );

  if (!userSubscription) {
    console.error(
      "User Subscription not found for Stripe customer:",
      customerId
    );
    return;
  }

  if (status === "active" || status === "trialing") {
    const product = await stripe.products.retrieve(
      subscription.items.data[0]?.price.product as string
    );

    await updateUserSubscription(userSubscription.id, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: product.id,
      planName: product.name,
      subscriptionStatus: status,
    });
  } else if (status === "canceled" || status === "unpaid") {
    await updateUserSubscription(userSubscription.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: status,
    });
  }
}

export async function createCustomerPortalSession(
  subscription: DrizzleSubscription
) {
  if (!subscription.stripeCustomerId || !subscription.stripeProductId) {
    redirect("/");
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(
      subscription.stripeProductId
    );
    if (!product.active) {
      throw new Error("Product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the team's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: "Manage your subscription",
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price", "quantity", "promotion_code"],
          proration_behavior: "create_prorations",
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id),
            },
          ],
        },
        subscription_cancel: {
          enabled: true,
          mode: "at_period_end",
          cancellation_reason: {
            enabled: true,
            options: [
              "too_expensive",
              "missing_features",
              "switched_service",
              "unused",
              "other",
            ],
          },
        },
      },
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.AUTH_URL}/dashboard`,
    configuration: configuration.id,
  });
}
