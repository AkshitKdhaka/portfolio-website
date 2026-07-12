import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js doesn't get confused by stray
  // lockfiles outside the project (e.g. one in the home directory).
  outputFileTracingRoot: __dirname,

  // Lint runs as its own dedicated CI step, so it should not also gate the
  // production build.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Type-checking runs as its own dedicated CI step (`tsc --noEmit`) on every
  // push before deploy, so we skip the in-build type check. This removes the
  // memory-heavy phase that OOM-kills `next build` on small (1GB) EC2 boxes.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Do NOT enable `output: "standalone"` here. PM2 runs `next start`, which
  // needs the normal `.next` output + `node_modules`. Standalone mode copies a
  // second near-full tree into `.next/standalone` and frequently hits ENOSPC
  // on small EC2 root volumes during CD.
};

export default nextConfig;
