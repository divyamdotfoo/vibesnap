"use client";
import { cn, rockSalt } from "@/lib/utils";
import { useCanvas } from "@/store";
import { useEffect, useRef, useState } from "react";

//
const FILTERS = [
  "original",
  "sunset",
  "vintage",
  "neon",
  "cyberpunk",
  "candy",
  "silverscreen",
  "noir",
  "dreamy",
  "firestorm",
  "galaxy",
  "holographic",
  "glitch",
  "pastel",
  "underwater",
  "popart",
  "rainbow",
  "sketch",
  "infrared",
] as const;
type FilterName = (typeof FILTERS)[number];
type Filters = [keyof typeof generateFilters, string][];

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

  const setBlobUrlFunc = (blob: string) =>
    setBlobUrls((prev) => [...prev, blob]);
  useEffect(() => {
    blobUrls.forEach((b) => {
      URL.revokeObjectURL(b);
    });
    setBlobUrls([]);
    async function populateFilters() {
      const newFilters: Filters = [];
      const pushFilter = (filter: [keyof typeof generateFilters, string]) =>
        newFilters.push(filter);
      for (const filter of FILTERS) {
        generateFilters[filter](
          ctx,
          originalImage,
          true,
          tempCanvas.current,
          filter,
          pushFilter,
          setBlobUrlFunc
        );
        await new Promise((res) => setTimeout(res, 30));
        console.log(newFilters);
      }
      setFilters(newFilters);
    }
    populateFilters();
  }, [originalImage]);
  useEffect(() => {
    console.log("length", filters.length);
    if (filters.length === FILTERS.length) {
      console.log("i ran");
      setShowCanvas(true);
      setLoading(false);
    }
  }, [filters]);
  return (
    <>
      <canvas
        ref={tempCanvas}
        className="hidden"
        width={360}
        height={450}
      ></canvas>
      {filters.length === FILTERS.length ? (
        <div className="flex flex-nowrap max-w-[350px] lg:max-w-[310px] lg:flex-wrap max-h-[300px] w-full scrollbar gap-4 overflow-x-scroll overflow-y-hidden lg:overflow-y-scroll lg:overflow-x-hidden items-start">
          {filters.map((filter) => (
            <div
              key={filter[0]}
              className=" w-[80px] flex-shrink-0 flex flex-col gap-1"
            >
              <button
                className="rounded-md w-full h-[100px]"
                onClick={() =>
                  generateFilters[filter[0]](ctx, originalImage, false)
                }
              >
                <img src={filter[1]} className="rounded-md w-full h-full" />
              </button>
              <p
                className={cn(
                  "text-center w-full text-xs font-medium opacity-100",
                  rockSalt.className
                )}
              >
                {filter[0]}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

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
  original: generateFilterFunction({ r: 1, g: 1, b: 1 }),
  sunset: generateFilterFunction({ r: 1.2, g: 1.1, b: 0.8 }),
  vintage: generateFilterFunction({ r: 1.3, g: 0.9, b: 0.7 }), // Toggle values for a different vintage look
  neon: generateFilterFunction({ r: 1.6, g: 0.8, b: 1.8 }), // Increase contrast for a vibrant neon effect
  cyberpunk: generateFilterFunction({ r: 0.7, g: 1.4, b: 1.6 }), // Shift towards blues and greens for a cyberpunk feel
  candy: generateFilterFunction({ r: 1.2, g: 0.9, b: 1.5 }),
  silverscreen: generateFilterFunction({ r: 1.1, g: 1.1, b: 0.9 }),
  noir: generateFilterFunction({ r: 1.3, g: 1.3, b: 1.3 }), // Increase overall brightness for a film noir effect
  dreamy: generateFilterFunction({ r: 1.2, g: 0.95, b: 1.3 }), // Soften colors for a dreamy atmosphere
  firestorm: generateFilterFunction({ r: 1.8, g: 0.3, b: 0.1 }), // Intense reds and oranges for a fiery effect
  galaxy: generateFilterFunction({ r: 0.5, g: 0.7, b: 1.5 }), // Deep blues and purples for a cosmic look
  holographic: generateFilterFunction({ r: 1.5, g: 0.6, b: 1.9 }), // Iridescent colors for a holographic vibe
  glitch: generateFilterFunction({ r: 1.4, g: 1.2, b: 0.5 }),
  pastel: generateFilterFunction({ r: 1.1, g: 1.3, b: 1.5 }),
  popart: generateFilterFunction({ r: 1.8, g: 0.9, b: 0.2 }),
  underwater: generateFilterFunction({ r: 0.5, g: 0.9, b: 1.6 }),
  rainbow: generateFilterFunction({ r: 1.8, g: 0.8, b: 1.2 }),
  sketch: generateFilterFunction({ r: 0.9, g: 0.9, b: 0.9 }),
  infrared: generateFilterFunction({ r: 0.9, g: 1.6, b: 1.4 }),
} as const;
