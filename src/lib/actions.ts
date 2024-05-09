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
  if (!data.items.length) {
    return {
      errorTitle: "Playlist is empty",
      errorMessage: "Fill your playlist and try again.",
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
  const headers = {
    Authorization: `Bearer ${process.env.SPOTIFY_TOKEN}`,
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
  if (data.items && !data.items.length) {
    return {
      errorTitle: "Playlist is empty",
      errorMessage: "Fill your playlist and try again.",
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
  return { errorTitle: "Oops!", errorMessage: "Try again later" };
};
