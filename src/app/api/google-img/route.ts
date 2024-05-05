export async function GET(req: Request) {
  const imgUrl = new URL(req.url).searchParams.get("url");
  if (!imgUrl) return Response.json({}, { status: 404 });
  const imgRes = await fetch(imgUrl);
  const data = await imgRes.arrayBuffer();
  return new Response(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "image/jpeg",
    },
  });
}
