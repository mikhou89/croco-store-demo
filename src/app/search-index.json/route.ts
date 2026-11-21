import { allLite } from "@/lib/catalog";

export const dynamic = "force-static";

export function GET() {
  return Response.json(allLite());
}
