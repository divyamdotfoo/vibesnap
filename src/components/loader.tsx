"use client";
import { cn, rockSalt } from "@/lib/utils";
import { useCanvas } from "@/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
export function Loader() {
  const loading = useCanvas((s) => s.loading);
  const loadingText = ["Chill vibes incoming ..."] as const;
  const [current, setCurrent] = useState("");
  useEffect(() => {
    for (let i = 0; i < loadingText[0].length; i++) {
      setTimeout(() => {
        setCurrent(loadingText[0].slice(0, i + 1));
      }, 30 * i);
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3"
    >
      <p className={cn("tracking-widest text-xl w-80", rockSalt.className)}>
        {current}
      </p>
    </motion.div>
  );
}
