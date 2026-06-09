import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });
import express from "express";
import cors from "cors";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, extractReasoningMiddleware, generateText, pipeUIMessageStreamToResponse, smoothStream, stepCountIs, streamText, wrapLanguageModel } from "ai";
import { webSearch } from "@exalabs/ai-sdk";

const __filename = new URL(import.meta.url).pathname;
const __dirname = __filename.substring(0, __filename.lastIndexOf("/"));

const app = express();
app.use(express.json());

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || undefined,
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "tendrra-api",
    version: "1.0.0",
  });
});

// AI SDK Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const coreMessages = await convertToModelMessages(messages);

    const wrappedModel = wrapLanguageModel({
      model: openrouter.chat("openai/gpt-4o-mini"),
      middleware: extractReasoningMiddleware({ tagName: "thought" }),
    });

    const result = streamText({
      model: wrappedModel,
      messages: coreMessages,
      system:
        "You are a helpful AI assistant for WorldAutomate — an enterprise automation platform. " +
        "You are agentic and have access to powerful tools: " +
        "1. webSearch: Use this to find real-time, up-to-date information. " +
        "CRITICAL: Always keep your output with current, up-to-date data. If asked about recent events, companies, or anything time-sensitive, ALWAYS use the webSearch tool to retrieve the latest information rather than relying on your training data. " +
        "Before answering, you must ALWAYS think step-by-step and write your internal reasoning inside <thought> and </thought> XML tags. After the </thought> tag, provide your final response to the user. " +
        "Be concise, helpful, and proactive. When you use tools, explain what you are doing and summarize the results clearly.",
      experimental_transform: smoothStream({
        delayInMs: 20,
        chunking: 'word',
      }),
      tools: {
        webSearch: webSearch(),
      },
      stopWhen: stepCountIs(5),
    });

    pipeUIMessageStreamToResponse({
      response: res,
      stream: result.toUIMessageStream({ originalMessages: messages }),
    });

    result.consumeStream();
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
});

// AI Suggestions Endpoint
app.post("/api/chat/suggestions", async (req, res) => {
  const { lastAssistantMessage } = req.body;

  if (!lastAssistantMessage) {
    return res.json({ suggestions: [] });
  }

  try {
    const result = await generateText({
      model: openrouter.chat("openai/gpt-4o-mini"),
      system:
        "You are a follow-up suggestion generator for an AI chat interface. " +
        "Given the AI's last response, generate exactly 4 short, relevant follow-up questions or actions the user might want to do next. " +
        "Each suggestion must be under 60 characters. " +
        "Return ONLY a JSON array of 4 strings, nothing else. Example: [\"Tell me more\", \"Show me an example\", \"How does this work?\", \"What are the alternatives?\"]",
      prompt: `AI's last response:\n\n${lastAssistantMessage.slice(0, 1000)}\n\nGenerate 4 follow-up suggestions as a JSON array.`,
    });

    let suggestions: string[] = [];
    try {
      const cleaned = result.text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      suggestions = JSON.parse(cleaned);
      if (!Array.isArray(suggestions)) suggestions = [];
    } catch {
      suggestions = [];
    }

    res.json({ suggestions: suggestions.slice(0, 4) });
  } catch (error) {
    console.error("Suggestions error:", error);
    res.json({ suggestions: [] });
  }
});

export const tendrraApi = app;

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}