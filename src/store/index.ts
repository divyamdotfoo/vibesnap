import { Thumbnails } from "@/types";
import { create } from "zustand";

type CanvasStore = {
  ctx: CanvasRenderingContext2D | null;
  setCtx: (ctx: CanvasRenderingContext2D | null) => void;
  originalImage: ImageData | null;
  setOriginalImage: () => void;
  showCanvas: boolean;
  setShow: (b: boolean) => void;
  loading: boolean;
  setLoading: (b: boolean) => void;
};
export const useCanvas = create<CanvasStore>((set) => ({
  ctx: null,
  setCtx: (ctx) => set((state) => ({ ctx: ctx })),
  originalImage: null,
  setOriginalImage: () => {
    const ctx = useCanvas.getState().ctx;
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, 450, 560);
      set({ originalImage: imgData });
    }
  },
  showCanvas: false,
  setShow: (b) => set({ showCanvas: b }),
  loading: false,
  setLoading: (b) => set({ loading: b }),
}));

type ThumbnailStore = {
  thumbnails: Thumbnails;
  setThumbnails: (z: Thumbnails) => void;
};

export const useThumbnails = create<ThumbnailStore>((set) => ({
  thumbnails: [],
  setThumbnails: (z) => set({ thumbnails: z }),
}));
