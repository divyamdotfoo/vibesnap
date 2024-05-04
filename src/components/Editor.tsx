import { useCanvas } from "@/store";
import { Slider } from "./ui/slider";
import { useState } from "react";

export function EditorTools() {
  return (
    <div className=" flex flex-col gap-2 items-start bg-purple-900 p-4">
      <AdjustTemperature />
    </div>
  );
}

function AdjustTemperature() {
  const [val, setVal] = useState([100]);
  const ctx = useCanvas((s) => s.ctx);
  return (
    <div className=" flex items-center gap-3">
      <p>Temperature</p>
      <Slider
        defaultValue={val}
        onValueChange={(z) => setVal(z)}
        max={200}
        step={1}
        className=" w-[200px]"
      />
      <span className=" w-8">{val[0] - 100}</span>
    </div>
  );
}
