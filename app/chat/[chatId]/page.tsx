import DocumentClient from "./_components/chat-client";
import Header from "./_components/header";
import { auth } from "@/utils/auth";
import UserIcon from "@/public/user-icon.webp";

export default async function Page(props: {
  params: Promise<{ chatId: string }>;
}) {
  const params = await props.params;
  const session = await auth();
  //   const user: User | null = await currentUser();

  //   const currentDoc = await prisma.document.findFirst({
  //     where: {
  //       id: params.id,
  //       userId: user?.id,
  //     },
  //   });

  const currentDoc = {
    id: "123",
    title: "Sample Document",
    content: "This is a sample document content",
    fileUrl:
      "https://zova.s3.us-east-1.amazonaws.com/84957980-2d0e-4b4f-a2b6-4aea17ee7c01/1731802563499-Documentation.pdf",
  };
  // https://zova.s3.us-east-1.amazonaws.com/84957980-2d0e-4b4f-a2b6-4aea17ee7c01/1731802563499-Documentation.pdf

  const userImage = session?.user?.image || UserIcon.src;

  if (!currentDoc) {
    return <div>This document was not found</div>;
  }

  return (
    <div>
      <Header />
      <DocumentClient currentDoc={currentDoc} userImage={userImage} />
    </div>
  );
}
