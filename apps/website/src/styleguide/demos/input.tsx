import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoGroup, DemoSection } from "../helpers";

export default function InputDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Sizes" vertical>
        <Input size="sm" placeholder="size=sm" className="w-64" />
        <Input size="default" placeholder="size=default" className="w-64" />
        <Input size="lg" placeholder="size=lg" className="w-64" />
      </DemoGroup>
      <DemoGroup label="Types">
        <div className="w-56 space-y-1">
          <Label htmlFor="sg-email">Email</Label>
          <Input id="sg-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="w-56 space-y-1">
          <Label htmlFor="sg-password">Password</Label>
          <Input id="sg-password" type="password" placeholder="••••••••" />
        </div>
      </DemoGroup>
      <DemoGroup label="States">
        <Input className="w-56" placeholder="Default" />
        <Input className="w-56" disabled placeholder="Disabled" />
        <Input className="w-56" aria-invalid placeholder="Invalid" />
      </DemoGroup>
    </DemoSection>
  );
}
