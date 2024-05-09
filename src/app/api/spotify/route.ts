import { readFile, writeFile } from "fs/promises";

export async function GET(req: Request) {
  const client_id = process.env.SPOTIFY_ID;
  const client_secret = process.env.SPOTIFY_SECRET;

  const authOptions = {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${client_id}:${client_secret}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    next: { revalidate: 0 },
  };
  const res = await fetch(
    "https://accounts.spotify.com/api/token",
    authOptions
  );
  const data = await res.json();
  if (data && data.access_token) {
    const envVars = (await readFile(".env.local", "utf-8"))
      .split("\n")
      .filter((v) => !v.startsWith("SPOTIFY_TOKEN"))
      .concat([`SPOTIFY_TOKEN=${data.access_token}`])
      .join("\n");
    await writeFile(".env.local", envVars);
  }

  return Response.json(
    {
      message: "ok",
      data,
    },
    { status: 200 }
  );
}
