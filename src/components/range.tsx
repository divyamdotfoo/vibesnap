"use client";
import { useCanvas, useThumbnails } from "@/store";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export function Range() {
  const { range, setRange } = useCanvas((s) => ({
    range: s.range,
    setRange: s.setRange,
  }));
  const maxRange = useThumbnails.getState().thumbnails.length;
  const VALID = [4, 6, 9, 12, 16, 20, 25, 30, 36];
  const validPoints = VALID.filter((z) => z <= maxRange).map((z, i) => [i, z]);
  const marks: Record<number, number> = Object.fromEntries(validPoints);
  return (
    <div className=" w-[280px] ">
      <Slider
        marks={marks}
        step={null}
        min={0}
        defaultValue={2}
        max={validPoints.length - 1}
        onChange={(v) => {
          if (!Array.isArray(v)) {
            setRange(marks[v]);
          }
        }}
        dotStyle={{
          border: "none",
          color: "whtie",
        }}
        styles={{
          handle: {
            boxShadow: "none",
            border: "solid 1px white",
          },
          track: {
            backgroundImage: `linear-gradient(
                to right,
                rgba(var(--yellow)),
                rgba(var(--orange)),
                rgba(var(--pink)),
                rgba(var(--purple)),
                rgba(var(--blue))
              )`,
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          },
        }}
      />
    </div>
  );
}
