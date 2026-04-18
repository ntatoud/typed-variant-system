import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DemoGroup, DemoSection } from "../helpers";

export default function SwitchDemo() {
  const [on, setOn] = useState(false);
  return (
    <DemoSection>
      <DemoGroup label="States">
        <div className="flex items-center gap-2">
          <Switch id="sw-off" checked={false} onCheckedChange={() => {}} />
          <Label htmlFor="sw-off">Off</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="sw-on" checked={true} onCheckedChange={() => {}} />
          <Label htmlFor="sw-on">On</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="sw-disabled" disabled />
          <Label htmlFor="sw-disabled">Disabled</Label>
        </div>
      </DemoGroup>
      <DemoGroup label="Interactive">
        <div className="flex items-center gap-2">
          <Switch id="sw-interactive" checked={on} onCheckedChange={setOn} />
          <Label htmlFor="sw-interactive">Email notifications</Label>
        </div>
      </DemoGroup>
    </DemoSection>
  );
}
