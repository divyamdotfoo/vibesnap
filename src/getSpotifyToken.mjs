import { readFile, writeFile } from "fs/promises";

async function main() {
  const client_id = "969e0f4680e44147b4f0be1b2c856b90";
  const client_secret = "ae511c959a68468ba03352849b25ba96";

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
  try {
    const res = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions
    );
    const data = await res.json();
    console.log(data);
    const keys = (await readFile(".env.local", "utf-8"))
      .split("\n")
      .slice(0, -1)
      .concat([`SPOTIFY_TOKEN=${data.access_token}`])
      .join("\n");

    await writeFile(".env.local", keys);
  } catch (e) {
    console.log(e);
  }
}

main();
