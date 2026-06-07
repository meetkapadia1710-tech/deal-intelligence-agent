import dotenv from "dotenv";
import { HindsightClient } from "@vectorize-io/hindsight-client";
import Groq from "groq-sdk";

dotenv.config();

export const hindsight = new HindsightClient({
  baseUrl: process.env.HINDSIGHT_BASE_URL || "https://api.hindsight.vectorize.io",
  apiKey: process.env.HINDSIGHT_API_KEY as string,
});

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });
export const BANK_ID = "deal-intelligence-agent";
