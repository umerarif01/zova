import DocumentClient from "./_components/chat-client";

export default async function Page(props: {
  params: Promise<{ chatId: string }>;
}) {
  const params = await props.params;
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
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  };

  const userImage = "./user-icon.png";

  if (!currentDoc) {
    return <div>This document was not found</div>;
  }

  return (
    <div>
      <DocumentClient currentDoc={currentDoc} userImage={userImage} />
    </div>
  );
}
