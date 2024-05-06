"use client";
import { getSpotifyThumbnails, getYoutubeVideoThumbnails } from "@/lib/actions";
import { extractPlaylistId } from "@/lib/utils";
import { useCanvas, useThumbnails } from "@/store";
import { useState } from "react";

export function Input() {
  const setImageUrls = useThumbnails((s) => s.setThumbnails);
  const { loading, setLoading } = useCanvas((s) => ({
    loading: s.loading,
    setLoading: s.setLoading,
  }));
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const handlefetchingThumbnails = async () => {
    if (!val) return;
    const extracted = extractPlaylistId(val);
    if (!extracted) return;
    setLoading(true);
    if (extracted.source === "youtube") {
      const data = await getYoutubeVideoThumbnails(extracted.id);
      if (!Array.isArray(data)) {
        setErr(data.error);
        return;
      }
      setImageUrls(data.slice(0, 36));
    }
    if (extracted.source === "spotify") {
      const data = await getSpotifyThumbnails(extracted.id);
      if (!Array.isArray(data)) {
        setErr(data.error);
        return;
      }
      setImageUrls(data.slice(0, 9));
    }
  };
  return (
    <div className=" flex items-stretch gap-4">
      <input
        type="text"
        value={val}
        className=" p-2 rounded-md text-primary shadow-2xl shadow-white bg-transparent placeholder:text-primary placeholder:opacity-80 placeholder:font-bold border-white border-2 focus:outline-none w-[400px]"
        placeholder="Drop spotify/youtube playlist link here"
        onChange={(e) => setVal(e.target.value)}
        autoFocus
        spellCheck={false}
      />

      <button
        className=" px-4 rounded-md text-lg font-semibold border-white border-2 shadow-2xl shadow-white"
        onClick={handlefetchingThumbnails}
      >
        {loading ? "Vibing..." : "Vibe it!"}
      </button>
      <span>{err}</span>
    </div>
  );
}
