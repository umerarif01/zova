import PageWrapper from "@/components/wrapper/page-wrapper";

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageWrapper>{children}</PageWrapper>;
}
