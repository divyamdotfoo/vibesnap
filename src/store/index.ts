import { drawImages } from "@/components/Canvas";
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
  range: number;
  setRange: (n: number) => void;
};
export const useCanvas = create<CanvasStore>((set) => ({
  ctx: null,
  setCtx: (ctx) => set((state) => ({ ctx: ctx })),
  originalImage: null,
  setOriginalImage: () => {
    const ctx = useCanvas.getState().ctx;
    if (ctx) {
      const canvasWidth = useCanvas.getState().ctx?.canvas.width!;
      const canvasHeight = useCanvas.getState().ctx?.canvas.height!;
      const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      set({ originalImage: imgData });
    }
  },
  showCanvas: false,
  setShow: (b) => set({ showCanvas: b }),
  loading: false,
  setLoading: (b) => set({ loading: b }),
  range: 9,
  setRange: (n) => {
    set({ range: n });
    const ctx = useCanvas.getState().ctx;
    const imgUrls = useThumbnails.getState().thumbnails.slice(0, n);
    if (ctx) {
      drawImages(ctx, imgUrls);
      const timeOut =
        imgUrls[0].source === "spotify"
          ? 50 * imgUrls.length
          : 50 * imgUrls.length;
      setTimeout(() => {
        useCanvas.getState().setOriginalImage();
      }, timeOut);
    }
  },
}));

type ThumbnailStore = {
  thumbnails: Thumbnails;
  setThumbnails: (z: Thumbnails) => void;
};

export const useThumbnails = create<ThumbnailStore>((set) => ({
  thumbnails: [],
  setThumbnails: (z) => set({ thumbnails: z }),
}));
