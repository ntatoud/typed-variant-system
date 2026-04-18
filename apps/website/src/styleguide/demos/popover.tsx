import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DemoGroup, DemoSection } from "../helpers";

export default function PopoverDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Filter popover">
        <Popover>
          <PopoverTrigger render={<Button variant="outline">Filter</Button>} />
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <p className="text-sm font-medium">Filter by status</p>
              {["Active", "Inactive", "Pending"].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <Checkbox id={`filter-${s}`} />
                  <Label htmlFor={`filter-${s}`}>{s}</Label>
                </div>
              ))}
              <Button size="sm" className="w-full mt-2">
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </DemoGroup>
      <DemoGroup label="Info popover">
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="sm">
                What is this?
              </Button>
            }
          />
          <PopoverContent className="w-64 text-sm text-muted-foreground">
            This setting controls how your workspace is billed each month.
          </PopoverContent>
        </Popover>
      </DemoGroup>
    </DemoSection>
  );
}
