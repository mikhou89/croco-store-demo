import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// The demo must never compete with crocostore.tn in search results.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
