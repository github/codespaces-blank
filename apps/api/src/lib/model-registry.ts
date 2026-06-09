import { google } from "@ai-sdk/google";

export const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash-exp";

export function resolveGoogleModel(modelId?: string | null) {
  const id = (modelId || DEFAULT_GEMINI_MODEL).trim();
  return google(id);
}

export type ModelMeta = { id: string; name: string; provider: "google" };

export function getAvailableModelsList(): ModelMeta[] {
  return [
    { id: "gemini-2.5-pro-preview-05-06", name: "Gemini 2.5 Pro (preview)", provider: "google" },
    { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash", provider: "google" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "google" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "google" },
  ];
}
