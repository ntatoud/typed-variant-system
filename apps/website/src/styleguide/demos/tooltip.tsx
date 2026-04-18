import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DemoGroup, DemoSection } from "../helpers";

export default function TooltipDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Sides">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger
              render={
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              }
            />
            <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
          </Tooltip>
        ))}
      </DemoGroup>
    </DemoSection>
  );
}
