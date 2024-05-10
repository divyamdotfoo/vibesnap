import GithubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/X";
import { Loader } from "@/components/loader";
import Link from "next/link";
import { Range } from "@/components/range";
import { Input } from "@/components/Input";
import { Vibes } from "@/components/HangingImage";
import { cn, rockSalt } from "@/lib/utils";
import { EditCanvas } from "@/components/Canvas";

export default function Page() {
  return (
    <div className=" w-full min-h-screen relative">
      {/* absoulutely positioned */}
      <Socials />
      <Loader />
      <div className="overflow-hidden absolute inset-0 -z-40">
        <div className="animate-gradient inset-0 absolute"></div>
      </div>
      <div className=" xl:max-w-[1200px]  mx-auto">
        <div className="flex flex-col w-full md:flex-row items-center lg:gap-16 gap-4 ">
          <h1 className={cn("text-5xl p-5", rockSalt.className)}>VibeSnap</h1>
          <Input />
        </div>
        <Vibes />
        <EditCanvas />
      </div>
    </div>
  );
}

function Socials() {
  return (
    <div className=" absolute lg:top-4 bottom-4 lg:bottom-auto  z-50 right-4  flex items-center gap-2">
      <Link href={"https://github.com/divyamdotfoo/vibesnap"} target="_blank">
        <GithubIcon />
      </Link>
      <Link href={"https://x.com/divyamdotfoo"}>
        <TwitterIcon />
      </Link>
    </div>
  );
}
