import { Thumbnails } from "@/types";
import { create } from "zustand";

type CanvasStore = {
  ctx: CanvasRenderingContext2D | null;
  setCtx: (ctx: CanvasRenderingContext2D | null) => void;
  temperature: number[];
  setTemperature: (val: number[]) => void;
  brightness: number[];
  setBrightness: (val: number[]) => void;
  setGrayScale: (val: number[]) => void;
  grayScale: number[];
  originalImage: ImageData | null;
  setOriginalImage: () => void;
  reset: () => void;
  showCanvas: boolean;
  setShow: (b: boolean) => void;
  loading: boolean;
  setLoading: (b: boolean) => void;
};
export const useCanvas = create<CanvasStore>((set) => ({
  ctx: null,
  setCtx: (ctx) => set((state) => ({ ctx: ctx })),
  temperature: [100],
  grayScale: [100],
  setTemperature: (v) => set(() => ({ temperature: v })),
  setGrayScale: (v) => set(() => ({ grayScale: v })),
  originalImage: null,
  setOriginalImage: () => {
    const ctx = useCanvas.getState().ctx;
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, 450, 560);
      set({ originalImage: imgData });
    }
  },
  reset: () => {
    set((s) => ({ temperature: [100], grayScale: [100] }));
    const ctx = useCanvas.getState().ctx;
    const original = useCanvas.getState().originalImage;
    if (ctx && original) {
      ctx.putImageData(original, 0, 0);
    }
  },
  brightness: [10],
  setBrightness: (v) => set({ brightness: v }),
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
