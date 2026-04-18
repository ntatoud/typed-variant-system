import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DemoGroup, DemoSection } from "../helpers";

export default function ProgressDemo() {
  const [value, setValue] = useState(42);
  return (
    <DemoSection>
      <DemoGroup label="Values" vertical>
        <Progress value={0} className="w-80" />
        <Progress value={25} className="w-80" />
        <Progress value={value} className="w-80" />
        <Progress value={100} className="w-80" />
      </DemoGroup>
      <DemoGroup label="Interactive">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => setValue((p) => Math.max(0, p - 10))}>
            −10
          </Button>
          <span className="w-10 text-center font-mono text-sm">{value}%</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setValue((p) => Math.min(100, p + 10))}
          >
            +10
          </Button>
        </div>
      </DemoGroup>
    </DemoSection>
  );
}
