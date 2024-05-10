"use server";
import {
  GoogleAPIResponse,
  SpotifyAPIResponse,
  ThumbnailResponse,
} from "@/types";
import { filterUniqueThumbnails } from "./utils";

export const getYoutubeVideoThumbnails = async (
  id: string
): Promise<ThumbnailResponse> => {
  const playListUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${process.env.YOUTUBE}&playlistId=${id}&part=snippet&maxResults=50`;
  const res = await fetch(playListUrl);
  if (!res)
    return {
      errorTitle: "Oops!",
      errorMessage: "Try again later",
    };
  const data = (await res.json()) as GoogleAPIResponse;
  if (!data.items) {
    return {
      errorTitle: "No playlist found",
      errorMessage: "Check your url and try again",
    };
  }
  if (!data.items.length || data.items.length <= 3) {
    return {
      errorTitle: "Add some more songs",
      errorMessage: "Your playlist has very less songs.",
    };
  }
  return filterUniqueThumbnails(
    data.items.map((d) => ({
      ...d.snippet.thumbnails.high,
      source: d.snippet.videoOwnerChannelTitle.endsWith("Topic")
        ? "youtube-topic"
        : "youtube",
    }))
  );
};

export const getSpotifyThumbnails = async (
  id: string
): Promise<ThumbnailResponse> => {
  try {
    const token = await getSpotifyToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${id}/tracks?limit=50&fields=items(track(album(images)))`,
      {
        headers: headers,
      }
    );
    if (!res)
      return {
        errorTitle: "Oops!",
        errorMessage: "Try again later",
      };
    const data = (await res.json()) as SpotifyAPIResponse;
    if (data.error)
      return {
        errorTitle: "No playlist found",
        errorMessage: "Check your url and try again",
      };
    if (
      (data.items && !data.items.length) ||
      (data.items && data.items.length <= 3)
    ) {
      return {
        errorTitle: "Add some more songs",
        errorMessage: "Your playlist has very less songs.",
      };
    }
    if (data.items) {
      return filterUniqueThumbnails(
        data.items
          .filter(
            (d) => d.track && d.track.album && d.track.album.images.length !== 0
          )
          .map((d) => ({ ...d.track.album.images[1], source: "spotify" }))
      );
    }
  } catch (e) {
    return {
      errorTitle: "Oops!",
      errorMessage: "Try again later",
    };
  }
  return { errorTitle: "Oops!", errorMessage: "Try again later" };
};

const getSpotifyToken = async () => {
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
  if (data.access_token) {
    console.log(data.access_token);
    return data.access_token as string;
  }
  throw new Error("");
};
