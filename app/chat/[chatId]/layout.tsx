import Header from "./_components/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
