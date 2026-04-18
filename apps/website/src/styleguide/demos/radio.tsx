import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DemoGroup, DemoSection } from "../helpers";

export default function RadioDemo() {
  const [value, setValue] = useState("editor");
  return (
    <DemoSection>
      <DemoGroup label="Role selection" vertical>
        <RadioGroup value={value} onValueChange={setValue} className="space-y-1">
          {["viewer", "editor", "admin"].map((r) => (
            <div key={r} className="flex items-center gap-2">
              <RadioGroupItem value={r} id={`radio-${r}`} />
              <Label htmlFor={`radio-${r}`} className="capitalize">
                {r}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </DemoGroup>
      <DemoGroup label="Disabled">
        <RadioGroup defaultValue="b">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="a" id="radio-dis-a" disabled />
            <Label htmlFor="radio-dis-a" className="text-muted-foreground">
              Option A
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="b" id="radio-dis-b" />
            <Label htmlFor="radio-dis-b">Option B</Label>
          </div>
        </RadioGroup>
      </DemoGroup>
    </DemoSection>
  );
}
