import { Badge } from "@/components/ui/badge";
import { DemoGroup, DemoSection } from "../helpers";

export default function BadgeDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Variants">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </DemoGroup>
      <DemoGroup label="With content">
        <Badge>
          <span className="size-1.5 rounded-full bg-green-500" />
          Active
        </Badge>
        <Badge variant="secondary">12 new</Badge>
        <Badge variant="destructive">3 errors</Badge>
      </DemoGroup>
    </DemoSection>
  );
}
