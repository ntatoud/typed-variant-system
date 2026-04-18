import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DemoGroup, DemoSection } from "../helpers";

export default function SheetDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Sides">
        {(["right", "left", "top", "bottom"] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger
              render={
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              }
            />
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>Changes are saved automatically.</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-1">
                  <Label htmlFor={`sheet-name-${side}`}>Name</Label>
                  <Input id={`sheet-name-${side}`} defaultValue="Alice Martin" />
                </div>
              </div>
              <SheetFooter className="mt-6">
                <Button className="w-full">Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </DemoGroup>
    </DemoSection>
  );
}
