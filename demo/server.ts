import { serve } from "bun";
// @ts-ignore - Bun allows importing HTML files as route objects
import homepage from "./public/index.html";

const server = serve({
  routes: {
    "/": homepage,
  },
  development: {
    hmr: true,
    console: true,
  },
  fetch(req): Response {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Demo server running on ${server.url}`);
