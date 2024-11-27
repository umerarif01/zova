import { ReactNode } from "react";
import DashboardSideBar from "./_components/dashboard-side-bar";
import DashboardTopNav from "./_components/dashbord-top-nav";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session?.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <DashboardSideBar />
      <DashboardTopNav>
        <main className="flex flex-col gap-4 p-4 lg:gap-6">{children}</main>
      </DashboardTopNav>
    </div>
  );
}
