import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoGroup, DemoSection } from "../helpers";

export default function CardDemo() {
  return (
    <DemoSection>
      <DemoGroup label="With form">
        <Card className="w-72">
          <CardHeader>
            <CardTitle>Workspace settings</CardTitle>
            <CardDescription>Manage your workspace name and visibility.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Name</Label>
              <Input id="workspace-name" defaultValue="My workspace" />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </DemoGroup>
      <DemoGroup label="Simple">
        <Card className="w-56 p-4">
          <p className="text-sm font-medium">Total revenue</p>
          <p className="mt-1 text-2xl font-bold">$12,480</p>
          <p className="mt-1 text-xs text-muted-foreground">+8% from last month</p>
        </Card>
      </DemoGroup>
    </DemoSection>
  );
}
