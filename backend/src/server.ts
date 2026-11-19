import "dotenv/config";
import { app } from "./app";
import { connectDatabase } from "./config/database";

const port = Number(process.env.PORT ?? 4000);

async function start() {
  await connectDatabase();
  app.listen(port, () => console.log(`QuizMaster API listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
