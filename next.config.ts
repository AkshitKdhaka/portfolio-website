import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js doesn't get confused by stray
  // lockfiles outside the project (e.g. one in the home directory).
  outputFileTracingRoot: __dirname,

  // Lint runs as its own dedicated CI step, so it should not also gate the
  // production build. The build still type-checks; only ESLint is skipped here.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Produce a self-contained server bundle (.next/standalone) that is ideal
  // for containerized/serverless AWS deployments in the upcoming CD pipeline.
  output: "standalone",
};

export default nextConfig;
