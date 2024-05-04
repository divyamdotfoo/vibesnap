import { Thumbnails, thumbnailType } from "@/types";
import { create } from "zustand";

type CanvasStore = {
  ctx: CanvasRenderingContext2D | null;
  setCtx: (ctx: CanvasRenderingContext2D | null) => void;
};
export const useCanvas = create<CanvasStore>((set) => ({
  ctx: null,
  setCtx: (ctx) => set((state) => ({ ctx: ctx })),
}));

type ThumbnailStore = {
  thumbnails: Thumbnails;
  setThumbnails: (z: Thumbnails) => void;
};

export const useThumbnails = create<ThumbnailStore>((set) => ({
  thumbnails: [],
  setThumbnails: (z) => set((state) => ({ thumbnails: z })),
}));
