import { thumbnailType } from "@/types";
import { useEffect, useRef } from "react";
import { useCanvas, useThumbnails } from "@/store";
export function EditCanvas() {
  const imgUrls = useThumbnails((s) => s.thumbnails);
  const { ctx, setCtx } = useCanvas((s) => ({
    ctx: s.ctx,
    setCtx: s.setCtx,
  }));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  console.log("canvas component");
  useEffect(() => {
    if (canvasRef.current) {
      setCtx(canvasRef.current.getContext("2d"));
    }
  }, [canvasRef]);

  useEffect(() => {
    console.log("it subscribed to changes");
    if (ctx && canvasRef.current) {
      console.log("ctx is present");
      drawImages(ctx, imgUrls, canvasRef.current);
    }
  }, [imgUrls]);

  return (
    <div className="">
      <canvas
        ref={canvasRef}
        width={450}
        height={560}
        className=" bg-white mx-auto"
      />
    </div>
  );
}

function drawImages(
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
  console.log(tileLayout);
  if (tileLayout.totalTiles - imgUrls.length > 0) {
    console.log("inside if");
    const prevColLength = tileLayout.cols;
    tileLayout = calculateTileLayout(
      imgUrls.length - prevColLength,
      canvasEl.width,
      canvasEl.height
    );
  }
  console.log(tileLayout);
  imgUrls.slice(0, tileLayout.totalTiles).forEach((imgUrl, idx) => {
    const image = new Image();
    image.src = imgUrl.url;
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
