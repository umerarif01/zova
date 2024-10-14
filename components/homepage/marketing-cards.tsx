"use client";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bolt,
  BarChart,
  Palette,
  Scroll,
  Globe2,
  ShieldCheck,
} from "lucide-react"; // Relevant lucide-react icons

const FeaturesData = [
  {
    id: 1,
    name: "Lightning Fast",
    description:
      "Instant responses from the chatbot so you don't leave your users waiting.",
    icon: Bolt,
    url: "#",
  },
  {
    id: 2,
    name: "Analytics and Reports",
    description:
      "Robust analytics and reporting tools that enable you to monitor your agent's performance and make data-driven decisions.",
    icon: BarChart,
    url: "#",
  },
  {
    id: 3,
    name: "Customizable",
    description:
      "Fully customizable agent with your own branding, colors, and design elements to create a seamless user experience.",
    icon: Palette,
    url: "#",
  },
  {
    id: 4,
    name: "Chat Logs",
    description:
      "Keep track of your agent's interactions with detailed chat logs.",
    icon: Scroll,
    url: "#",
  },
  {
    id: 5,
    name: "Multilingual",
    description:
      "Multiple language support allows your agent to converse with users in their preferred language, enabling you to reach a wider audience.",
    icon: Globe2,
    url: "#",
  },
  {
    id: 6,
    name: "Encrypted and Secure",
    description:
      "Industry-leading data privacy and security policies to protect user data, giving peace of mind.",
    icon: ShieldCheck,
    url: "#",
  },
];

const SpringAnimatedFeatures = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full px-4 sm:px-6 lg:px-8 lg:w-[75%]">
      <div className="flex flex-col mb-8 sm:mb-12">
        <h2
          className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900 text-center`}
        >
          See How Our AI Agents Can Benefit You
        </h2>
        <p className="mx-auto max-w-[500px] text-gray-600 dark:text-gray-400 text-center mt-2 text-sm sm:text-base">
          {`We've built a platform that is easy to use and has all the features
          you need to build the best agent.`}
        </p>
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {FeaturesData.map((feature) => {
          return (
            <motion.div
              whileHover={{
                y: -8,
              }}
              transition={{
                type: "spring",
                bounce: 0.7,
              }}
              key={feature.id}
              className="mt-5 text-left border p-4 sm:p-6 rounded-md dark:bg-black"
            >
              <Link
                href={feature?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <feature.icon className="mb-3 h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400" />
                <div className="mb-1 text-sm sm:text-base font-medium ">
                  {feature.name}
                </div>
                <div className="text-xs sm:text-sm font-normal text-gray-600 dark:text-gray-400">
                  {feature.description}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SpringAnimatedFeatures;
