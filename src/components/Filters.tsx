import { useCanvas } from "@/store";
import { useEffect, useRef, useState } from "react";

//
const FILTERS = [
  "sunset",
  "vintage",
  "neon",
  "cyberpunk",
  "cotton-candy",
  "silverscreen",
  "noir",
  "dreamy",
] as const;

export function Filters() {
  const { ctx, originalImage } = useCanvas((s) => ({
    originalImage: s.originalImage,
    ctx: s.ctx,
  }));
  const tempCanvas = useRef<HTMLCanvasElement | null>(null);
  const [filters, setFilters] = useState<Filters>([]);
  const setFilterFunc = (filter: [keyof typeof generateFilters, string]) => {
    setFilters((prev) => [...prev, filter]);
  };
  useEffect(() => {
    setFilters([]);
    async function populateFilters() {
      for (const filter of FILTERS) {
        await new Promise((res) => setTimeout(res, 20));
        generateFilters[filter](
          ctx,
          originalImage,
          true,
          tempCanvas.current,
          filter,
          setFilterFunc
        );
      }
    }
    populateFilters();
  }, [originalImage]);
  return (
    <>
      <canvas
        ref={tempCanvas}
        className=" hidden"
        width={450}
        height={560}
      ></canvas>

      {filters.length === FILTERS.length ? (
        <div className="grid grid-cols-2 gap-3">
          {filters.map((filter) => (
            <div>
              <button
                className=" w-48 h-60"
                onClick={() =>
                  generateFilters[filter[0]](ctx, originalImage, false)
                }
              >
                <img src={filter[1]} className=" w-full h-full" />
              </button>
              <p className=" text-xl font-bold pt-2 text-center">{filter[0]}</p>
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
  setFilter?: (filter: [keyof typeof generateFilters, string]) => void
) => void;

const generateFilterFunction = (rgbFactor: {
  r: number;
  g: number;
  b: number;
}) => {
  const func = (
    ctx: CanvasRenderingContext2D | null,
    original: ImageData | null,
    generateImage: boolean,
    tempCanvas?: HTMLCanvasElement | null,
    filterName?: keyof typeof generateFilters,
    setFilter?: (filter: [keyof typeof generateFilters, string]) => void
  ) => {
    if (!ctx || !original) return;
    const data = new Uint8ClampedArray(original.data);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = original.data[i] * rgbFactor.r;
      data[i + 1] = original.data[i + 1] * rgbFactor.g;
      data[i + 2] = original.data[i + 2] * rgbFactor.b;
    }
    const newImageData = ctx.createImageData(450, 560);
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
  "cotton-candy": generateFilterFunction({ r: 1.2, g: 0.9, b: 1.5 }),
  silverscreen: generateFilterFunction({ r: 1.1, g: 1.1, b: 0.9 }),
  noir: generateFilterFunction({ r: 1.3, g: 1.3, b: 1.3 }), // Increase overall brightness for a film noir effect
  dreamy: generateFilterFunction({ r: 1.2, g: 0.95, b: 1.3 }), // Soften colors for a dreamy atmosphere
} as const;
