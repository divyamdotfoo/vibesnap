"use client";
import { getSpotifyThumbnails, getYoutubeVideoThumbnails } from "@/lib/actions";
import { cn, extractPlaylistId, rockSalt } from "@/lib/utils";
import { useCanvas, useThumbnails } from "@/store";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";

export function Input() {
  const setImageUrls = useThumbnails((s) => s.setThumbnails);
  const { toast } = useToast();
  const { setLoading, setShowCanvas } = useCanvas((s) => ({
    loading: s.loading,
    setLoading: s.setLoading,
    setShowCanvas: s.setShow,
  }));
  const [val, setVal] = useState("");
  const handlefetchingThumbnails = async () => {
    if (!val) return;
    const extracted = extractPlaylistId(val);
    if (!extracted) return;
    setLoading(true);
    setShowCanvas(false);
    if (extracted.source === "youtube") {
      const data = await getYoutubeVideoThumbnails(extracted.id);
      if (!Array.isArray(data)) {
        setLoading(false);
        toast({
          title: data.errorTitle,
          description: data.errorMessage,
        });
        return;
      }
      setImageUrls(data.slice(0, 36));
    }
    if (extracted.source === "spotify") {
      const data = await getSpotifyThumbnails(extracted.id);
      if (!Array.isArray(data)) {
        setLoading(false);
        toast({
          title: data.errorTitle,
          description: data.errorMessage,
        });
        return;
      }
      setImageUrls(data.slice(0, 9));
    }
  };
  return (
    <div className=" flex w-full md:w-auto items-stretch justify-around md:gap-4">
      <input
        type="text"
        value={val}
        className={cn(
          " p-2 rounded-md placeholder:tracking-wider text-sm text-primary shadow-2xl shadow-white/60 bg-transparent placeholder:text-primary placeholder:opacity-80 placeholder:font-bold border-white border-2 focus:outline-none w-2/3 md:w-[300px] lg:w-[360px]",
          rockSalt.className
        )}
        placeholder="Drop your playlist link here"
        onChange={(e) => setVal(e.target.value)}
        autoFocus
        spellCheck={false}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          " px-4 rounded-md md:text-lg text-base font-semibold border-white border-2 shadow-2xl shadow-white/60",
          rockSalt.className
        )}
        onClick={handlefetchingThumbnails}
      >
        Vibe it !
      </motion.button>
    </div>
  );
}
