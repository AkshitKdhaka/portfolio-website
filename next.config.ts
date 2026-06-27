import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js doesn't get confused by stray
  // lockfiles outside the project (e.g. one in the home directory).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
