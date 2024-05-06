"use client";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import hero1 from "../../public/hero-1.png";
import hero2 from "../../public/hero-2.png";
import hero3 from "../../public/hero-3.png";
import hero4 from "../../public/hero-4.png";
import hero5 from "../../public/hero-5.png";
import { useCanvas } from "@/store";

export function Vibes() {
  const showCanvas = useCanvas((s) => s.showCanvas);
  return (
    <AnimatePresence>
      {!showCanvas && (
        <motion.div
          key="vibes"
          className="p-10 grid grid-cols-3 gap-y-10 gap-x-0 justify-items-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <HangingImage img={hero1} hangWith="rope" />
          <HangingImage img={hero2} hangWith="tape" />
          <HangingImage img={hero3} hangWith="rope" />
          <HangingImage img={hero4} hangWith="tape" />
          <HangingImage img={hero5} hangWith="tape" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HangingImage({
  img,
  hangWith,
  className,
}: {
  img: StaticImageData;
  hangWith: "rope" | "tape";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-48 h-56  bg-none border-none  relative shrink-0",
        className
      )}
    >
      {hangWith === "rope" && (
        <div className=" w-32 h-32 rounded-lg absolute  border-white/80 -z-10 border-dashed -rotate-45  -translate-y-1/4 translate-x-8 border-4"></div>
      )}
      {hangWith === "tape" && (
        <>
          <div className=" absolute z-30 w-24 h-10 bg-gray-200/40 -rotate-[35deg]  -top-7 -left-3"></div>
        </>
      )}

      <Image
        src={img}
        alt="vibe snapshot"
        className={cn(
          " w-full h-full rounded-md z-10 shadow-2xl shadow-white/40"
        )}
        style={{
          transform: hangWith === "tape" ? "rotate(15deg)" : "",
        }}
      />
    </div>
  );
}
