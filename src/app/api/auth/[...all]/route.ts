import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Cloudflare Pages er edge runtime enable kora holo
export const runtime = "edge";

export const { GET, POST } = toNextJsHandler(auth);
