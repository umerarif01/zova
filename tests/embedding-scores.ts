import "dotenv/config";
import { getMatchesFromEmbeddings } from "@/utils/context";
import { getEmbeddings } from "@/utils/embeddings";

async function testEmbeddingScores() {
  try {
    const testQueries = ["What is DataSciMI?", "What are imporant dates?"];

    // This chatbot is trained using data from the following URL: https://datasci.world/.
    // The purpose of this test is to evaluate the embedding scores for various queries.

    const chatbotId = "80242b0f-bbfb-40f8-9209-f8000ab5e51f";

    console.log("Starting embedding score test...\n");

    for (const query of testQueries) {
      console.log(`\nTesting query: "${query}"`);
      console.log("-".repeat(50));

      const queryEmbeddings = await getEmbeddings(query);
      const matches = await getMatchesFromEmbeddings(
        queryEmbeddings,
        chatbotId
      );

      matches.forEach((match: any, index: number) => {
        console.log(`\nMatch ${index + 1}:`);
        console.log(`Score: ${match.score}`);
        console.log(
          `Text preview: ${(match.metadata as any).text.substring(0, 100)}...\n`
        );
      });
    }
  } catch (error) {
    console.error("Error running embedding score tests:", error);
  } finally {
    // Exit the process
    process.exit(0);
  }
}

// Run the test
testEmbeddingScores();
