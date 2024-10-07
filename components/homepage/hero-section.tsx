import { ArrowRight, ArrowRightIcon, Github } from "lucide-react";
import Link from "next/link";
import { BorderBeam } from "../magicui/border-beam";
import { Button } from "../ui/button";
import Image from "next/image";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";
import { AnimatedBeamMultipleOutputDemo } from "./animated-beam";
import AnimatedShinyText from "../magicui/animated-shiny-text";

export default function HeroSection() {
  return (
    <section
      className="flex flex-col items-center justify-center leading-6 mt-[3rem]"
      aria-label="Nextjs Starter Kit Hero"
    >
      <div
        className={
          "mb-4 group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        }
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>✨ Introducing Zova</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
      <h1
        className={`${TITLE_TAILWIND_CLASS} max-w-[700px] scroll-m-20 font-semibold tracking-tight text-center`}
      >
        Build and Deploy Tailored Agents Powered by Your Data
      </h1>
      <p className="mx-auto max-w-[700px] text-gray-500 text-center mt-2 dark:text-gray-400">
        Train agents using your PDFs, Word documents, websites, and more.
        Empower them to deliver accurate, data-driven insights tailored to your
        needs.
      </p>
      <div className="flex justify-center items-center gap-3">
        <Link href="/sign-in" className="mt-5">
          <Button variant="outline" className="flex gap-1">
            Get Started
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
      <div className="relative flex max-w-6xl justify-center overflow-hidden mt-7 w-full m">
        <AnimatedBeamMultipleOutputDemo />
      </div>
    </section>
  );
}
