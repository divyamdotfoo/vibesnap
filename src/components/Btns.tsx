import { cn, rockSalt } from "@/lib/utils";
import { useCanvas } from "@/store";
import Download from "@mui/icons-material/FileDownloadOutlined";
import Share from "@mui/icons-material/ShareOutlined";
import { useRef } from "react";
import { motion } from "framer-motion";
export function DownLoadButton() {
  const downloadLink = useRef<HTMLAnchorElement | null>(null);
  const { ctx } = useCanvas((s) => ({
    ctx: s.ctx,
  }));
  const handler = () => {
    if (ctx && ctx.canvas && downloadLink.current) {
      const dataUrl = ctx.canvas.toDataURL();
      downloadLink.current.href = dataUrl;
      downloadLink.current.click();
    }
  };
  return (
    <>
      <motion.button
        onClick={handler}
        className=" border-2 border-white px-4 py-2 flex items-center  gap-2 rounded-sm shadow-xl shadow-black/20"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
      >
        <p className={cn(rockSalt.className, "text-sm")}>Download</p>
        <Download fontSize="medium" />
      </motion.button>
      <a ref={downloadLink} download={"vibe.png"}></a>
    </>
  );
}

export function ShareBtn() {
  const ctx = useCanvas((s) => s.ctx);
  const handler = () => {
    if (ctx && ctx.canvas && navigator) {
      ctx.canvas.toBlob(async (b) => {
        if (b) {
          if (!navigator.canShare) {
            return console.log("not allowed");
          }
          try {
            console.log("going to share", b);
            await navigator.share({
              title: "Vibe",
              text: "Vibesnap: Share your playlist's mosaic magic! 🎵✨ #Vibesnap #MusicMosaic",
              files: [new File([b], "vibesnap", { type: b.type })],
            });
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
  };
  return (
    <button
      onClick={handler}
      className={cn(
        "sm:hidden border-2 border-white px-4 py-2 rounded-sm shadow-xl text-sm shadow-black/20 flex items-center gap-2",
        rockSalt.className
      )}
    >
      <p>Share</p>
      <Share fontSize="medium" />
    </button>
  );
}
