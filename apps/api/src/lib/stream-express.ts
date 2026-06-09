import type { Response as ExpressResponse } from "express";
import { Readable } from "node:stream";

export async function pipeWebResponseToExpress(
  webResponse: globalThis.Response,
  res: ExpressResponse
) {
  res.status(webResponse.status);
  webResponse.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "content-encoding" || lower === "transfer-encoding") return;
    res.setHeader(key, value);
  });
  if (!webResponse.body) {
    res.end();
    return;
  }
  await new Promise<void>((resolve, reject) => {
    Readable.fromWeb(webResponse.body as import("stream/web").ReadableStream)
      .on("error", reject)
      .pipe(res)
      .on("finish", () => resolve())
      .on("error", reject);
  });
}
