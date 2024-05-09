"use client";
import { thumbnailType } from "@/types";
import { useEffect, useRef } from "react";
import { useCanvas, useThumbnails } from "@/store";
import { DownLoadButton, ShareBtn } from "./Btns";
import { Filters } from "./Filters";
import { cn } from "@/lib/utils";
export function EditCanvas() {
  const imgUrls = useThumbnails((s) => s.thumbnails);
  const { ctx, setCtx, setOriginal, setShowCanvas, showCanvas, setLoading } =
    useCanvas((s) => ({
      ctx: s.ctx,
      setCtx: s.setCtx,
      setOriginal: s.setOriginalImage,
      showCanvas: s.showCanvas,
      setShowCanvas: s.setShow,
      setLoading: s.setLoading,
    }));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      setCtx(canvasRef.current.getContext("2d"));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (ctx && canvasRef.current && imgUrls.length) {
      drawImages(ctx, imgUrls, canvasRef.current);
      const timeOut =
        imgUrls[0].source === "spotify"
          ? 100 * imgUrls.length
          : 80 * imgUrls.length;
      setTimeout(() => {
        setOriginal();
        setShowCanvas(true);
        setLoading(false);
      }, timeOut);
    }
  }, [imgUrls]);

  return (
    <div
      className={cn(
        "flex items-center gap-4 justify-center pt-5 pb-2p0 z-0 ",
        showCanvas ? "" : "hidden"
      )}
    >
      <div className=" flex flex-col items-center gap-4 md:w-[360px] w-[320px]">
        <canvas
          ref={canvasRef}
          width={360}
          height={450}
          className="rounded-md md:w-[360px] md:h-[450px] w-[320px] h-[400px]"
        />
        <Filters />
      </div>
      <div className=" hidden md:flex flex-col gap-2">
        <DownLoadButton />
        <ShareBtn />
      </div>
    </div>
  );
}

export function drawImages(
  ctx: CanvasRenderingContext2D,
  imgUrls: {
    source: thumbnailType;
    url: string;
  }[],
  canvasEl: HTMLCanvasElement
) {
  if (!imgUrls.length) return;
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  let tileLayout: ReturnType<typeof calculateTileLayout>;
  tileLayout = calculateTileLayout(
    imgUrls.length,
    canvasEl.width,
    canvasEl.height
  );
  if (tileLayout.totalTiles - imgUrls.length > 0) {
    const prevColLength = tileLayout.cols;
    tileLayout = calculateTileLayout(
      imgUrls.length - prevColLength,
      canvasEl.width,
      canvasEl.height
    );
  }
  imgUrls.slice(0, tileLayout.totalTiles).forEach((imgUrl, idx) => {
    const image = new Image();
    image.src = imgUrl.url;
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      const xPosition = (idx % tileLayout.cols) * tileLayout.tileWidth;
      const yPosition =
        Math.floor(idx / tileLayout.cols) * tileLayout.tileHeight;
      ctx.drawImage(
        image,
        imgUrl.source === "youtube-topic" ? 105 : 0,
        imgUrl.source === "spotify" ? 0 : 45,
        imgUrl.source === "youtube-topic" ? image.width - 210 : image.width,
        imgUrl.source === "spotify" ? image.height : image.height - 90,
        xPosition,
        yPosition,
        tileLayout.tileWidth,
        tileLayout.tileHeight
      );
    };
  });
}

const calculateTileLayout = (
  tiles: number,
  canvasWidth: number,
  canvasHeight: number,
  aspectRatio = 1
) => {
  const canvasAspectRatio = canvasWidth / canvasHeight;

  let rows, cols;
  if (canvasAspectRatio > aspectRatio) {
    cols = Math.ceil(Math.sqrt(tiles));
    rows = Math.ceil(tiles / cols);
  } else {
    rows = Math.ceil(Math.sqrt(tiles));
    cols = Math.ceil(tiles / rows);
  }
  let tileWidth = canvasWidth / cols;
  let tileHeight = canvasHeight / rows;
  const totalTiles = rows * cols;

  return { rows, cols, tileWidth, tileHeight, totalTiles };
};
