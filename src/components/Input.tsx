import { getSpotifyThumbnails, getYoutubeVideoThumbnails } from "@/lib/actions";
import { extractPlaylistId } from "@/lib/utils";
import { useThumbnails } from "@/store";
import { useState } from "react";

export function Input() {
  const setImageUrls = useThumbnails((s) => s.setThumbnails);
  const [val, setVal] = useState(
    "https://open.spotify.com/playlist/37i9dQZEVXbpwhnGOKerlZ"
  );
  const [err, setErr] = useState("");
  const handlefetchingThumbnails = async () => {
    if (!val) return;
    const extracted = extractPlaylistId(val);
    if (!extracted) return;
    if (extracted.source === "youtube") {
      const data = await getYoutubeVideoThumbnails(extracted.id);
      if (!Array.isArray(data)) {
        setErr(data.error);
        return;
      }
      setImageUrls(data);
    }
    if (extracted.source === "spotify") {
      const data = await getSpotifyThumbnails(extracted.id);
      if (!Array.isArray(data)) {
        setErr(data.error);
        return;
      }
      setImageUrls(data);
    }
  };
  return (
    <div className=" flex items-center gap-8">
      <input
        type="text"
        value={val}
        className=" p-2 rounded-md text-black"
        onChange={(e) => setVal(e.target.value)}
      />
      <button
        className=" px-4 py-2 bg-purple-500 rounded-md"
        onClick={handlefetchingThumbnails}
      >
        Generate
      </button>
      <span>{err}</span>
    </div>
  );
}
