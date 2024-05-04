import { Thumbnails, thumbnailType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractPlaylistId(url: string): {
  source: "youtube" | "spotify";
  id: string;
} | null {
  if (url.includes("youtube.com")) {
    const pattern = /list=([^&]+)/;
    const match = url.match(pattern);
    if (match)
      return {
        source: "youtube",
        id: match[1],
      };
  }
  if (url.includes("spotify.com")) {
    const pattern = /playlist\/([^?]+)/;
    const match = url.match(pattern);
    if (match) return { source: "spotify", id: match[1] };
  }
  return null;
}

export const filterUniqueThumbnails = async (
  thumbnails: {
    url: string;
    width: number;
    height: number;
    source: thumbnailType;
  }[]
) => {
  const imageSet = new Set();
  const uniqueThumbnails: Thumbnails = [];
  const thumbnailHashes = await Promise.all(
    thumbnails.map(async (thumbnail) => {
      const res = await fetch(thumbnail.url, {
        method: "HEAD",
      });
      const size = res.headers.get("Content-Length");
      const meta = size ? parseInt(size, 10) : null;
      return {
        url: thumbnail.url,
        thumbnailHash: `${meta}-${thumbnail.width}-${thumbnail.width}`,
        source: thumbnail.source,
      };
    })
  );
  7;

  for (const tHash of thumbnailHashes) {
    if (!imageSet.has(tHash.thumbnailHash)) {
      imageSet.add(tHash.thumbnailHash);
      uniqueThumbnails.push({ source: tHash.source, url: tHash.url });
    }
  }
  return uniqueThumbnails;
};
