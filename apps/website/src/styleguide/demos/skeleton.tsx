import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DemoGroup, DemoSection } from "../helpers";

export default function SkeletonDemo() {
  return (
    <DemoSection>
      <DemoGroup label="List item">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </DemoGroup>
      <DemoGroup label="Card">
        <Card className="w-56">
          <CardContent className="pt-4 space-y-3">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
        </Card>
      </DemoGroup>
      <DemoGroup label="Text block" vertical>
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-4 w-60" />
      </DemoGroup>
    </DemoSection>
  );
}
