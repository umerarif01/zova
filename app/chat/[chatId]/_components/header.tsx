import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white w-full border-b border-b-slate-200 shadow-sm">
      <div className="h-16 py-4 container mx-auto">
        <nav className="flex justify-between mx-10">
          <Link
            href="/dashboard"
            className="hover:text-slate-600 cursor-pointer flex items-center"
          >
            <Logo />
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/zova-logo.png"
        alt="Zova Logo"
        width={35}
        height={35}
        className="mr-2"
      />
      <span className="font-semibold">zova.chat</span>
    </div>
  );
}
