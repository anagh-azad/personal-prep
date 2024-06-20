import { GoogleGenerativeAI } from "@google/generative-ai";
// import { loadEnvConfig } from "@next/env";
// import { cwd } from "node:process";

// loadEnvConfig(cwd());

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain"
};

export const chatSession = model.startChat({
  generationConfig
});
