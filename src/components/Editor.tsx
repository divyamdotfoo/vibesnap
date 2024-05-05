import { useCanvas } from "@/store";
import { Slider } from "./ui/slider";

export function EditorTools() {
  // original image data and edited image data should be different reset should to original and 0 should kdsjfkljsdf
  return (
    <div className=" flex flex-col gap-2 items-start bg-purple-900 p-4">
      <AdjustTemperature />
      <AdjustGrayScale />
      <AdjustBrightness />
      <Reset />
    </div>
  );
}

function Reset() {
  const resetImg = useCanvas((s) => s.reset);
  return (
    <button onClick={resetImg} className=" underline">
      Reset
    </button>
  );
}
function AdjustTemperature() {
  const { setVal, val, ctx, originalImgData, setOriginalData } = useCanvas(
    (s) => ({
      val: s.temperature,
      setVal: s.setTemperature,
      ctx: s.ctx,
      originalImgData: s.originalImage,
      setOriginalData: s.setOriginalImage,
    })
  );
  const adjust = (strength: number, original: number) => {
    const plusStrength = Math.ceil((180 - original) / 100);
    const minusStrength = Math.ceil(original / 100);
    if (strength === 100) return original;
    return strength > 100
      ? Math.min(original + (strength - 100) * plusStrength, 180)
      : Math.max(original - (100 - strength) * minusStrength, 0);
  };
  return (
    <div className=" flex items-center gap-3">
      <p>Temperature</p>
      <Slider
        defaultValue={val}
        onValueChange={(z) => {
          if (!ctx) return;
          if (!originalImgData) {
            setOriginalData();
          }
          setVal(z);
          if (originalImgData) {
            const tempImgData = ctx.getImageData(0, 0, 450, 560);
            const tempData = tempImgData.data;
            for (let i = 0; i < tempData.length; i += 4) {
              const originalR = originalImgData.data[i];
              tempData[i] = adjust(val[0], originalR);
            }
            ctx.putImageData(tempImgData, 0, 0);
          }
        }}
        max={200}
        step={1}
        className=" w-[200px]"
      />
      <span className=" w-8">{val[0] - 100}</span>
    </div>
  );
}

function AdjustGrayScale() {
  const { setVal, val, ctx, originalImgData, setOriginalData } = useCanvas(
    (s) => ({
      val: s.grayScale,
      setVal: s.setGrayScale,
      ctx: s.ctx,
      originalImgData: s.originalImage,
      setOriginalData: s.setOriginalImage,
    })
  );
  const adjust = (strength: number, original: number) => {
    return strength > 100
      ? original - (strength - 100) * 0.5
      : original + (100 - strength) * 0.5;
  };
  return (
    <div className=" flex items-center gap-3">
      <p>Grayscale</p>
      <Slider
        defaultValue={val}
        onValueChange={(val) => {
          if (!ctx) return;
          if (!originalImgData) {
            setOriginalData();
          }
          if (originalImgData) {
            setVal(val);
            if (val[0] === 100) {
              ctx.putImageData(originalImgData, 0, 0);
              return;
            }
            const tempImgData = getImgData(ctx);
            const tempData = tempImgData.data;
            for (let i = 0; i < tempData.length; i += 4) {
              const originalAvg = Math.floor(
                (originalImgData.data[i] +
                  originalImgData.data[i + 1] +
                  originalImgData.data[i + 2]) /
                  3
              );
              tempData[i] = adjust(val[0], originalAvg);
              tempData[i + 1] = adjust(val[0], originalAvg);
              tempData[i + 2] = adjust(val[0], originalAvg);
            }
            ctx.putImageData(tempImgData, 0, 0);
          }
        }}
        max={200}
        step={1}
        className=" w-[200px]"
      />
      <span className=" w-8">{val[0] - 100}</span>
    </div>
  );
}

function AdjustBrightness() {
  const { setVal, ctx, originalImage, val, setOriginal } = useCanvas((s) => ({
    ctx: s.ctx,
    originalImage: s.originalImage,
    setOriginal: s.setOriginalImage,
    val: s.brightness,
    setVal: s.setBrightness,
  }));
  const adjust = (strength: number, original: number) => {
    return (strength - 10) * 5 + original;
  };
  return (
    <div className=" flex items-center gap-2">
      <p>Brightness</p>
      <Slider
        className=" w-[200px]"
        value={val}
        step={1}
        max={20}
        onValueChange={(val) => {
          setVal(val);
          if (!originalImage) {
            setOriginal();
          }
          if (originalImage && ctx) {
            const tempImg = getImgData(ctx);
            const tempData = tempImg.data;
            for (let i = 0; i < tempData.length; i += 4) {
              tempData[i] = adjust(val[0], originalImage.data[i]);
              tempData[i + 1] = adjust(val[0], originalImage.data[i + 1]);
              tempData[i + 2] = adjust(val[0], originalImage.data[i + 2]);
            }
            ctx.putImageData(tempImg, 0, 0);
          }
        }}
      />
      <span>{val[0] - 10}</span>
    </div>
  );
}

const getImgData = (ctx: CanvasRenderingContext2D) =>
  ctx.getImageData(0, 0, 450, 560);
