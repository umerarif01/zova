import { Button } from "@/components/ui/button";
import NavBar from "@/components/wrapper/navbar";
import Link from "next/link";

export default function Banned() {
  return (
    <main className="flex justify-center items-center w-full flex-col my-[4rem]">
      <h1 className="mt-[20rem] scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        You are banned from this site 🚫
      </h1>
      <p className="leading-7">Unfortunately, your access has been revoked.</p>
      <div className="mt-5">
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    </main>
  );
}
