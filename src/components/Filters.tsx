"use client";
import { useCanvas } from "@/store";
import { useEffect, useRef, useState } from "react";

//
const FILTERS = [
  "sunset",
  "vintage",
  "neon",
  "cyberpunk",
  "candy",
  "silverscreen",
  "noir",
  "dreamy",
] as const;

export function Filters() {
  const { ctx, originalImage, setShowCanvas, setLoading } = useCanvas((s) => ({
    originalImage: s.originalImage,
    ctx: s.ctx,
    setShowCanvas: s.setShow,
    setLoading: s.setLoading,
  }));
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const tempCanvas = useRef<HTMLCanvasElement | null>(null);
  const [filters, setFilters] = useState<Filters>([]);
  const setFilterFunc = (filter: [keyof typeof generateFilters, string]) => {
    setFilters((prev) => [...prev, filter]);
  };
  const setBlobUrlFunc = (blob: string) =>
    setBlobUrls((prev) => [...prev, blob]);
  useEffect(() => {
    setFilters([]);
    blobUrls.forEach((b) => {
      URL.revokeObjectURL(b);
    });
    setBlobUrls([]);
    async function populateFilters() {
      for (const filter of FILTERS) {
        await new Promise((res) => setTimeout(res, 30));
        generateFilters[filter](
          ctx,
          originalImage,
          true,
          tempCanvas.current,
          filter,
          setFilterFunc,
          setBlobUrlFunc
        );
      }
    }
    populateFilters();
  }, [originalImage]);
  return (
    <>
      <canvas
        ref={tempCanvas}
        className="hidden"
        width={360}
        height={450}
      ></canvas>
      {filters.length === FILTERS.length ? (
        <div className="flex flex-nowrap max-w-[400px] w-full no-scrollbar gap-4 overflow-x-scroll items-start">
          {filters.map((filter) => (
            <div key={filter[0]} className=" w-[80px] flex flex-col">
              <button
                className="rounded-md w-[80px] h-[100px]"
                onClick={() =>
                  generateFilters[filter[0]](ctx, originalImage, false)
                }
              >
                <img
                  src={filter[1]}
                  className="rounded-md"
                  width={80}
                  height={100}
                />
              </button>
              <p className="text-center w-full font-medium opacity-100">
                {filter[0]}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

type FilterName = (typeof FILTERS)[number];
type Filters = [keyof typeof generateFilters, string][];
type GenerateFilterFunction = (
  ctx: CanvasRenderingContext2D | null,
  original: ImageData | null,
  generateImage: boolean,
  tempCanvas?: HTMLCanvasElement | null,
  filterName?: keyof typeof generateFilters,
  setFilter?: (filter: [keyof typeof generateFilters, string]) => void,
  setBlobUrl?: (blobUrl: string) => void
) => void;

const generateFilterFunction = (rgbFactor: {
  r: number;
  g: number;
  b: number;
}) => {
  const func: GenerateFilterFunction = (
    ctx: CanvasRenderingContext2D | null,
    original: ImageData | null,
    generateImage: boolean,
    tempCanvas?: HTMLCanvasElement | null,
    filterName?: keyof typeof generateFilters,
    setFilter?: (filter: [keyof typeof generateFilters, string]) => void,
    setBlobUrl?: (blob: string) => void
  ) => {
    if (!ctx || !original) return;
    const data = new Uint8ClampedArray(original.data);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = original.data[i] * rgbFactor.r;
      data[i + 1] = original.data[i + 1] * rgbFactor.g;
      data[i + 2] = original.data[i + 2] * rgbFactor.b;
    }
    const newImageData = ctx.createImageData(original.width, original.height);
    newImageData.data.set(data);
    if (!generateImage) {
      ctx.putImageData(newImageData, 0, 0);
      return;
    }
    if (tempCanvas) {
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.putImageData(newImageData, 0, 0);
        tempCanvas.toBlob((b) => {
          if (!b) return;
          const blobUrl = URL.createObjectURL(b);
          if (setBlobUrl) {
            setBlobUrl(blobUrl);
          }
          if (setFilter && filterName) {
            setFilter([filterName, blobUrl]);
          }
        });
      }
    }
  };
  return func;
};

const generateFilters: Record<FilterName, GenerateFilterFunction> = {
  sunset: generateFilterFunction({ r: 1.2, g: 1.1, b: 0.8 }),
  vintage: generateFilterFunction({ r: 1.3, g: 0.9, b: 0.7 }), // Toggle values for a different vintage look
  neon: generateFilterFunction({ r: 1.6, g: 0.8, b: 1.8 }), // Increase contrast for a vibrant neon effect
  cyberpunk: generateFilterFunction({ r: 0.7, g: 1.4, b: 1.6 }), // Shift towards blues and greens for a cyberpunk feel
  candy: generateFilterFunction({ r: 1.2, g: 0.9, b: 1.5 }),
  silverscreen: generateFilterFunction({ r: 1.1, g: 1.1, b: 0.9 }),
  noir: generateFilterFunction({ r: 1.3, g: 1.3, b: 1.3 }), // Increase overall brightness for a film noir effect
  dreamy: generateFilterFunction({ r: 1.2, g: 0.95, b: 1.3 }), // Soften colors for a dreamy atmosphere
} as const;
