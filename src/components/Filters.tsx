"use client";
import { cn, rockSalt } from "@/lib/utils";
import { useCanvas } from "@/store";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const FILTERS = [
  ["original", { r: 1, g: 1, b: 1 }],
  ["sunset", { r: 1.2, g: 1.1, b: 0.8 }],
  ["vintage", { r: 1.3, g: 0.9, b: 0.7 }],
  ["neon", { r: 1.6, g: 0.8, b: 1.8 }],
  ["cyberpunk", { r: 0.7, g: 1.4, b: 1.6 }],
  ["candy", { r: 1.2, g: 0.9, b: 1.5 }],
  ["silverscreen", { r: 1.1, g: 1.1, b: 0.9 }],
  ["noir", { r: 1.3, g: 1.3, b: 1.3 }],
  ["dreamy", { r: 1.2, g: 0.95, b: 1.3 }],
  ["firestorm", { r: 1.8, g: 0.3, b: 0.1 }],
  ["galaxy", { r: 0.5, g: 0.7, b: 1.5 }],
  ["holographic", { r: 1.5, g: 0.6, b: 1.9 }],
  ["glitch", { r: 1.4, g: 1.2, b: 0.5 }],
  ["pastel", { r: 1.1, g: 1.3, b: 1.5 }],
  ["popart", { r: 1.8, g: 0.9, b: 0.2 }],
  ["underwater", { r: 0.5, g: 0.9, b: 1.6 }],
  ["rainbow", { r: 1.8, g: 0.8, b: 1.2 }],
  ["sketch", { r: 0.9, g: 0.9, b: 0.9 }],
  ["infrared", { r: 0.9, g: 1.6, b: 1.4 }],
] as const;

type FiltersWithUrl = [(typeof FILTERS)[number][0], string][];
type FilterName = (typeof FILTERS)[number][0];

export function Filters() {
  const { ctx, originalImage, setShowCanvas, setLoading } = useCanvas((s) => ({
    originalImage: s.originalImage,
    ctx: s.ctx,
    setShowCanvas: s.setShow,
    setLoading: s.setLoading,
  }));
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const tempCanvas = useRef<HTMLCanvasElement | null>(null);
  const [filters, setFilters] = useState<FiltersWithUrl>([]);

  const setBlobUrlFunc = (blob: string) =>
    setBlobUrls((prev) => [...prev, blob]);

  useEffect(() => {
    blobUrls.forEach((b) => {
      URL.revokeObjectURL(b);
    });
    setBlobUrls([]);
    generateFiltersData({
      ctx,
      filters: [],
      index: 0,
      original: originalImage,
      setBlobUrl: setBlobUrlFunc,
      setFilters: setFilters,
      setLoading,
      setShowCanvas,
      tempCanvas: tempCanvas.current,
    });
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
        <div className="flex flex-nowrap max-w-[350px] lg:max-w-[310px] lg:flex-wrap max-h-[300px] w-full scrollbar gap-4 overflow-x-scroll overflow-y-hidden lg:overflow-y-scroll lg:overflow-x-hidden items-start">
          {filters.map((filter) => (
            <div
              key={filter[0]}
              className=" w-[80px] flex-shrink-0 flex flex-col gap-1"
            >
              <button
                className="rounded-md w-full h-[100px]"
                onClick={() =>
                  applyFilter({
                    ctx,
                    original: originalImage,
                    filterName: filter[0],
                  })
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

type GenerateFilterFuncProps = {
  index: number;
  ctx: CanvasRenderingContext2D | null;
  original: ImageData | null | undefined;
  tempCanvas: HTMLCanvasElement | null;
  setFilters: Dispatch<SetStateAction<FiltersWithUrl>>;
  setBlobUrl: (blob: string) => void;
  setLoading: (bool: boolean) => void;
  setShowCanvas: (bool: boolean) => void;
  filters: FiltersWithUrl;
};

type ApplyFilterFunctionProps = {
  ctx: CanvasRenderingContext2D | null;
  original: ImageData | null | undefined;
  filterName: FilterName;
};

const applyFilter = ({
  ctx,
  filterName,
  original,
}: ApplyFilterFunctionProps) => {
  if (!ctx || !original) return;
  const filterType = FILTERS.find((f) => f[0] === filterName);
  if (!filterType) return;
  const data = new Uint8ClampedArray(original.data);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = original.data[i] * filterType[1].r;
    data[i + 1] = original.data[i + 1] * filterType[1].g;
    data[i + 2] = original.data[i + 2] * filterType[1].b;
  }
  const newImageData = ctx.createImageData(original.width, original.height);
  newImageData.data.set(data);
  ctx.putImageData(newImageData, 0, 0);
  return;
};

const generateFiltersData = ({
  ctx,
  original,
  tempCanvas,
  setBlobUrl,
  setFilters,
  index,
  setLoading,
  setShowCanvas,
  filters,
}: GenerateFilterFuncProps) => {
  if (index >= FILTERS.length) {
    setFilters(filters);
    setLoading(false);
    setShowCanvas(true);
    return;
  }
  if (!ctx || !original) return;
  const data = new Uint8ClampedArray(original.data);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = original.data[i] * FILTERS[index][1].r;
    data[i + 1] = original.data[i + 1] * FILTERS[index][1].g;
    data[i + 2] = original.data[i + 2] * FILTERS[index][1].b;
  }
  const newImageData = ctx.createImageData(original.width, original.height);
  newImageData.data.set(data);
  if (tempCanvas) {
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCtx.putImageData(newImageData, 0, 0);
      tempCanvas.toBlob((b) => {
        if (!b) return;
        const blobUrl = URL.createObjectURL(b);
        setBlobUrl(blobUrl);
        const newFilters: FiltersWithUrl = [
          ...filters,
          [FILTERS[index][0], blobUrl],
        ];
        const newIndex = index + 1;
        generateFiltersData({
          index: newIndex,
          ctx,
          original,
          setBlobUrl,
          setFilters,
          setLoading,
          setShowCanvas,
          tempCanvas,
          filters: newFilters,
        });
      });
    }
  }
};
