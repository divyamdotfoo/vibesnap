"use client";
import { thumbnailType } from "@/types";
import { useEffect, useRef } from "react";
import { useCanvas, useThumbnails } from "@/store";
import { DownLoadButton, ShareBtn } from "./Btns";
import { Filters } from "./Filters";
import { cn } from "@/lib/utils";
import { Range } from "./range";
export function EditCanvas() {
  const imgUrls = useThumbnails((s) => s.thumbnails);
  const { ctx, setCtx, setOriginal, showCanvas, range } = useCanvas((s) => ({
    ctx: s.ctx,
    setCtx: s.setCtx,
    setOriginal: s.setOriginalImage,
    showCanvas: s.showCanvas,
    setShowCanvas: s.setShow,
    setLoading: s.setLoading,
    range: s.range,
  }));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      setCtx(canvasRef.current.getContext("2d"));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (ctx && canvasRef.current && imgUrls.length) {
      drawImages(ctx, imgUrls.slice(0, range));
      const timeOut =
        imgUrls[0].source === "spotify" ? 80 * range : 120 * range;
      setTimeout(() => {
        setOriginal();
      }, timeOut);
    }
  }, [imgUrls]);

  return (
    <div
      className={cn(" md:pt-5 pt-10 pb-20 z-0 ", showCanvas ? "" : "hidden")}
    >
      <div className=" flex flex-col lg:flex-row lg:items-start items-center justify-center lg:gap-4 gap-6 ">
        <canvas
          ref={canvasRef}
          width={360}
          height={450}
          className="rounded-md md:w-[360px] md:h-[450px] w-[320px] h-[400px]"
        />
        <div className=" flex flex-col md:items-start items-center gap-6">
          <Filters />
          <Range />
          <div className=" pt-4 flex gap-2 items-center w-full justify-center ">
            <DownLoadButton />
            <ShareBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export function drawImages(
  ctx: CanvasRenderingContext2D,
  imgUrls: {
    source: thumbnailType;
    url: string;
  }[]
) {
  if (!imgUrls.length) return;
  const canvasEl = ctx.canvas;
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
