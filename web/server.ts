import next from "next";
import type { Server } from "node:http";

export async function createWebHandler(httpServer: Server) {
  const app = next({ dev: false, dir: import.meta.dirname, httpServer });
  await app.prepare();
  return app.getRequestHandler();
}
