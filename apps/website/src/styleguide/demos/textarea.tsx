import { Textarea } from "@/components/ui/textarea";
import { DemoGroup, DemoSection } from "../helpers";

export default function TextareaDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Sizes" vertical>
        <Textarea size="sm" placeholder="size=sm" className="w-72" rows={2} />
        <Textarea size="default" placeholder="size=default" className="w-72" rows={2} />
        <Textarea size="lg" placeholder="size=lg" className="w-72" rows={2} />
      </DemoGroup>
      <DemoGroup label="States">
        <Textarea placeholder="Default" className="w-72" rows={2} />
        <Textarea disabled placeholder="Disabled" className="w-72" rows={2} />
        <Textarea aria-invalid placeholder="Invalid" className="w-72" rows={2} />
      </DemoGroup>
    </DemoSection>
  );
}
