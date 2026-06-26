/**
 * entry.server.tsx — Cloudflare Workers SSR entry
 * ใช้ @react-router/cloudflare แทน @react-router/node
 * เพื่อหลีกเลี่ยง Node.js built-in modules ที่ไม่ทำงานบน Workers
 */
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext
) {
  const userAgent = request.headers.get("user-agent");
  const readyOption: keyof typeof ReactDOMServer = isbot(userAgent ?? "")
    ? "onAllReady"
    : "onShellReady";

  return new Promise<Response>(async (resolve, reject) => {
    let status = responseStatusCode;
    let didError = false;

    const stream = await renderToReadableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        signal: AbortSignal.timeout(ABORT_DELAY),
        onError(error: unknown) {
          didError = true;
          status = 500;
          console.error(error);
        },
      }
    );

    // Wait for all content for bots, otherwise stream immediately
    if (isbot(userAgent ?? "")) {
      await stream.allReady;
    }

    const headers = new Headers(responseHeaders);
    headers.set("Content-Type", "text/html; charset=utf-8");

    resolve(
      new Response(stream, {
        status: didError ? 500 : status,
        headers,
      })
    );
  });
}

// Stub to satisfy TypeScript — not needed on Cloudflare Workers
declare namespace ReactDOMServer {
  const onAllReady: string;
  const onShellReady: string;
}
