export type YoutubeThumbnailKeys =
  | "maxres"
  | "default"
  | "high"
  | "medium"
  | "standard";

export type YoutubeThumbnails = {
  [key in YoutubeThumbnailKeys]: {
    url: string;
    width: number;
    height: number;
  };
};

export type GoogleAPIResponse = {
  etag: string;
  kind: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    etag: string;
    id: string;
    kind: string;
    snippet: {
      channelTitle: string;
      thumbnails: YoutubeThumbnails;
    };
  }[];
};

export type SpotifyAPIResponse = {
  items?: Array<{
    track: {
      album: {
        images: Array<{
          height: number;
          width: number;
          url: string;
        }>;
      };
    };
  }>;
  error?: {
    message: string;
    status: number;
  };
};

export type ThumbnailResponse = Promise<
  | {
      source: "youtube" | "spotify";
      url: string;
    }[]
  | {
      error: string;
    }
>;
