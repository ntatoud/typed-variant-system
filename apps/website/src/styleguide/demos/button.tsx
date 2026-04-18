import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DemoGroup, DemoSection } from "../helpers";

export default function ButtonDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <DemoSection>
      <DemoGroup label="Variants">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </DemoGroup>
      <DemoGroup label="Sizes">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon-sm">⚡</Button>
        <Button size="icon">⚡</Button>
        <Button size="icon-lg">⚡</Button>
      </DemoGroup>
      <DemoGroup label="States">
        <Button disabled>Disabled</Button>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          {loading ? "Saving…" : "Loading state"}
        </Button>
      </DemoGroup>
    </DemoSection>
  );
}
