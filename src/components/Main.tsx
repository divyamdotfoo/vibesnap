"use client";
import { EditCanvas } from "./Canvas";
import { Filters } from "./Filters";
import { Input } from "./Input";

export function Main() {
  return (
    <>
      <Input />
      <div className=" flex pt-4 gap-4 items-start justify-center">
        <EditCanvas />
        {/* <EditorTools /> */}
        <Filters />
      </div>
    </>
  );
}

const cachedUrls = () => [
  "https://i.ytimg.com/vi/9vWNauaZAgg/hqdefault.jpg",
  "https://i.ytimg.com/vi/BciS5krYL80/hqdefault.jpg",
  "https://i.ytimg.com/vi/CHIWNDAwTqQ/hqdefault.jpg",
  "https://i.ytimg.com/vi/lhg9bYNLvOg/hqdefault.jpg",
  "https://i.ytimg.com/vi/9RfVp-GhKfs/hqdefault.jpg",
  "https://i.ytimg.com/vi/pqrUQrAcfo4/hqdefault.jpg",
  "https://i.ytimg.com/vi/BLZWkjBXfN8/hqdefault.jpg",
  "https://i.ytimg.com/vi/j1gfAStPNlU/hqdefault.jpg",
  "https://i.ytimg.com/vi/tzVJPgCn-Z8/hqdefault.jpg",
  "https://i.ytimg.com/vi/jenWdylTtzs/hqdefault.jpg",
  "https://i.ytimg.com/vi/QowqM7LUMBY/hqdefault.jpg",
  "https://i.ytimg.com/vi/qwVJ7FWc4rQ/hqdefault.jpg",
  "https://i.ytimg.com/vi/p9TD5qn3fm4/hqdefault.jpg",
  "https://i.ytimg.com/vi/tbdpv7G_PPg/hqdefault.jpg",
  "https://i.ytimg.com/vi/x-xTttimcNk/hqdefault.jpg",
  "https://i.ytimg.com/vi/yl-Ms_ek-kE/hqdefault.jpg",
  "https://i.ytimg.com/vi/170sceOWWXc/hqdefault.jpg",
  "https://i.ytimg.com/vi/MKUex3fci5c/hqdefault.jpg",
  "https://i.ytimg.com/vi/wwrTkhD_zm8/hqdefault.jpg",
  "https://i.ytimg.com/vi/bSnlKl_PoQU/hqdefault.jpg",
  "https://i.ytimg.com/vi/j5_0E38dQPw/hqdefault.jpg",
  "https://i.ytimg.com/vi/Gk781Z0ErmA/hqdefault.jpg",
  "https://i.ytimg.com/vi/7CgJ6Fwf8rY/hqdefault.jpg",
  "https://i.ytimg.com/vi/5eHkjPCGXKQ/hqdefault.jpg",
  "https://i.ytimg.com/vi/FhgFtXESdPk/hqdefault.jpg",
  "https://i.ytimg.com/vi/IGLVMBTIAPE/hqdefault.jpg",
  "https://i.ytimg.com/vi/l-5aPNxv-pU/hqdefault.jpg",
  "https://i.ytimg.com/vi/bpOSxM0rNPM/hqdefault.jpg",
  "https://i.ytimg.com/vi/qU9mHegkTc4/hqdefault.jpg",
  "https://i.ytimg.com/vi/ljUtuoFt-8c/hqdefault.jpg",
  "https://i.ytimg.com/vi/659pppwniXA/hqdefault.jpg",
  "https://i.ytimg.com/vi/u5CVsCnxyXg/hqdefault.jpg",
  "https://i.ytimg.com/vi/oMfMUfgjiLg/hqdefault.jpg",
  "https://i.ytimg.com/vi/wVLqFQ5QT7Y/hqdefault.jpg",
  "https://i.ytimg.com/vi/QWu-f7HFFJE/hqdefault.jpg",
  "https://i.ytimg.com/vi/rBA1jocMvnc/hqdefault.jpg",
  "https://i.ytimg.com/vi/9PpXu-2fPHc/hqdefault.jpg",
  "https://i.ytimg.com/vi/DCa-oXnDyzc/hqdefault.jpg",
];
