import { cn } from "@/lib/utils";
import { Rock_Salt } from "next/font/google";
import GithubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/X";
import { Input } from "@/components/Input";
import { Vibes } from "@/components/HangingImage";
import { EditCanvas } from "@/components/Canvas";
const rockSalt = Rock_Salt({ subsets: ["latin"], weight: ["400"] });
export default function Page() {
  return (
    <div className=" w-full h-full min-h-screen min-w-fit relative">
      <div className="overflow-hidden absolute inset-0 -z-40">
        <div className="animate-gradient inset-0 absolute"></div>
      </div>
      <div className="flex items-center gap-16">
        <h1 className={cn("text-5xl p-5", rockSalt.className)}>VibeSnap</h1>
        <Input />
      </div>
      <Vibes />
      <EditCanvas />
      <Socials />
    </div>
  );
}

function Socials() {
  return (
    <div className=" fixed bottom-4 right-4 flex items-center gap-2">
      <GithubIcon />
      <TwitterIcon />
    </div>
  );
}
