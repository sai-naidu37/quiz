
import "dotenv/config";
import { app } from "./app";
import { connectDatabase } from "./config/database";

const port = Number(process.env.PORT || 4000);

async function start() {
  try {
    console.log("Starting QuizMaster API...");
    console.log("Connecting to MongoDB...");

    await connectDatabase();

    console.log("MongoDB connected successfully");

    app.listen(port, "0.0.0.0", () => {
      console.log(`QuizMaster API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start API:", error);
    process.exit(1);
  }
}

start();
