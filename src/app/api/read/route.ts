import { readdir } from "fs/promises";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") as string;
  if (!slug) return Response.json({}, { status: 400 });
  const dir = await readdir(slug);
  return Response.json({ dir });
}
