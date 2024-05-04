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
  const playListUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${process.env.YOUTUBE}&playlistId=${id}&part=snippet&maxResults=12`;
  const res = await fetch(playListUrl);
  if (!res)
    return {
      error: "While getting the playlist from youtube",
    };
  const data = (await res.json()) as GoogleAPIResponse;
  if (!data.items) {
    return {
      error: "No playlist found",
    };
  }
  if (!data.items.length) {
    return {
      error: "Playlist is empty",
    };
  }
  return (
    await filterUniqueThumbnails(
      data.items.map((d) => d.snippet.thumbnails.high)
    )
  ).map((url) => ({ source: "youtube", url }));
};

export const getSpotifyThumbnails = async (
  id: string
): Promise<ThumbnailResponse> => {
  const headers = {
    Authorization: `Bearer ${process.env.SPOTIFY_TOKEN}`,
  };
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/tracks?limit=50&fields=items(track(album(images)))`,
    {
      headers: headers,
    }
  );
  if (!res) return { error: "internal server error" };
  const data = (await res.json()) as SpotifyAPIResponse;
  if (data.error) return { error: data.error.message };
  if (data.items) {
    console.log(data.items.map((d) => d.track.album.images).map((_) => _[1]));
    return (
      await filterUniqueThumbnails(
        data.items.map((d) => d.track.album.images).map((_) => _[1]) // for 300x300 image
      )
    ).map((t) => ({ source: "spotify", url: t }));
  }
  return { error: "Internal server error. Try again after some time" };
};
