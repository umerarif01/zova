export type KBSource = {
  id: string;
  chatbotId: string;
  userId: string;
  name: string;
  type: string;
  sourceKey: string;
  sourceUrl: string;
  status: "processing" | "completed" | "failed";
  vectorCount: number;
  createdAt: Date;
  updatedAt: Date;
};
