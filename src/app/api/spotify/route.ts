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
  };
  const res = await fetch(
    "https://accounts.spotify.com/api/token",
    authOptions
  );
  const data = await res.json();
  if (data && data.access_token) {
    process.env.SPOTIFY_TOKEN = data.access_token;
  }

  return Response.json({ message: "ok" }, { status: 200 });
}
