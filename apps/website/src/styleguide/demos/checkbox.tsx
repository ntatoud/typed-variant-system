import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DemoGroup, DemoSection } from "../helpers";

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <DemoSection>
      <DemoGroup label="Sizes">
        {(["sm", "default", "lg"] as const).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <Checkbox id={`cb-size-${s}`} size={s} defaultChecked />
            <Label htmlFor={`cb-size-${s}`} className="text-xs">
              {s}
            </Label>
          </div>
        ))}
      </DemoGroup>
      <DemoGroup label="States">
        <div className="flex items-center gap-2">
          <Checkbox id="cb-unchecked" />
          <Label htmlFor="cb-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb-checked" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
          <Label htmlFor="cb-checked">Checked</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb-disabled" disabled />
          <Label htmlFor="cb-disabled">Disabled</Label>
        </div>
      </DemoGroup>
    </DemoSection>
  );
}
