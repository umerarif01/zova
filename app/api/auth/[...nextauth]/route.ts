import { handlers } from "@/utils/auth"; // Referring to the auth.ts we just created

export const runtime = "edge"; // 'nodejs' (default) | 'edge'

export const { GET, POST } = handlers;
