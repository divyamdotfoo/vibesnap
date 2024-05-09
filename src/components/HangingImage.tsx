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
const VIBES = [hero1, hero2, hero3, hero4, hero5] as const;
type VibeImage = "rope" | "tape-2" | "tape-1-left" | "tape-1-right" | "tape-4";
export function Vibes() {
  const { loading, showCanvas } = useCanvas((s) => ({
    showCanvas: s.showCanvas,
    loading: s.loading,
  }));
  return (
    <AnimatePresence>
      {!showCanvas && !loading && (
        <motion.div
          key="vibes"
          className="py-16 px-4"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className=" flex items-center md:flex-row flex-col gap-10 justify-around w-full mb-10">
            <HangingImage img={hero1} hangWith="rope" />
            <HangingImage
              img={hero2}
              hangWith="tape-4"
              className="md:-translate-y-8"
            />
            <HangingImage
              img={hero3}
              hangWith="tape-1-right"
              className=" mt-12 md:mt-0"
            />
          </div>
          <div className="flex items-center md:flex-row flex-col gap-10 justify-around w-3/4 mx-auto">
            <HangingImage img={hero4} hangWith="tape-1-left" />
            <HangingImage img={hero5} hangWith="rope" />
          </div>
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
  hangWith: VibeImage;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-48 h-56  bg-none border-none  relative shrink-0",
        hangWith === "rope" ? " my-5" : "",
        className
      )}
    >
      {hangWith === "rope" && (
        <>
          <div className=" absolute top-0 left-1/2 -translate-x-3/4 w-6 h-24 border-l-transparent border-b-transparent border-white border-2 rounded-2xl -translate-y-3/4 -z-10">
            <div className=" absolute -top-[3px] w-[40px] h-[20px] rounded-2xl border-white border-2 border-t-transparent border-r-transparent"></div>
          </div>
        </>
      )}
      {hangWith === "tape-2" && (
        <>
          <div className=" absolute z-30 w-24 h-10 bg-gray-200/40 -rotate-[35deg]  -top-4 -left-12"></div>
          <div className=" absolute z-30 w-24 h-10 bg-gray-200/40 rotate-[35deg]  -top-4 -right-12"></div>
        </>
      )}
      {hangWith === "tape-4" && (
        <>
          <div className=" absolute z-30 w-24 h-10 bg-gray-200/40 -rotate-[35deg]  -top-4 -left-12"></div>
          <div className=" absolute z-30 w-24 h-10 bg-gray-200/40 rotate-[35deg]  -top-4 -right-12"></div>
          <div className=" absolute z-30 w-24 h-10 bg-gray-200/40 rotate-[35deg] -bottom-4 -left-12"></div>
          <div className=" absolute z-30 w-24 h-10 bg-gray-200/40 -rotate-[35deg]  -bottom-4 -right-12"></div>
        </>
      )}
      {hangWith === "tape-1-left" && (
        <div className="absolute z-30 w-24 h-10 bg-gray-200/40 -rotate-[35deg]  -top-8 -left-4"></div>
      )}
      {hangWith === "tape-1-right" && (
        <div className="absolute z-30 w-24 h-10 bg-gray-200/40 rotate-[35deg]  -top-8 -right-4"></div>
      )}

      <Image
        src={img}
        alt="vibe snapshot"
        className={cn(
          " w-full h-full rounded-md z-10 shadow-2xl shadow-white/40"
        )}
        priority
        style={{
          transform:
            hangWith === "tape-1-left"
              ? "rotate(15deg)"
              : hangWith === "tape-1-right"
              ? "rotate(-15deg)"
              : "",
        }}
      />
    </div>
  );
}
