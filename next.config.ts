import type { NextConfig } from "next";

// Static export: the demo is plain HTML/JS, so it can be hosted for free anywhere
// (Vercel Hobby, Netlify, Cloudflare Pages or GitHub Pages).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
