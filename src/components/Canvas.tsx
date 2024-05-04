import { useEffect, useRef, useState } from "react";

export function EditCanvas({
  imgUrls,
}: {
  imgUrls: {
    source: "youtube" | "spotify";
    url: string;
  }[];
}) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  console.log("canvas component");
  useEffect(() => {
    if (canvasRef.current) {
      setCtx(canvasRef.current.getContext("2d"));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (ctx && canvasRef.current) {
      drawImages(ctx, imgUrls, canvasRef.current);
    }
  }, [imgUrls]);

  return (
    <div className=" pt-4">
      <canvas
        ref={canvasRef}
        width={768}
        height={560}
        className=" bg-white mx-auto border-purple-900 border-4"
      />
    </div>
  );
}

function drawImages(
  ctx: CanvasRenderingContext2D,
  imgUrls: {
    source: "youtube" | "spotify";
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
        imgUrl.source === "youtube" ? 105 : 0,
        imgUrl.source === "youtube" ? 45 : 0,
        imgUrl.source === "youtube" ? image.width - 210 : image.width,
        imgUrl.source === "youtube" ? image.height - 90 : image.height,
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
