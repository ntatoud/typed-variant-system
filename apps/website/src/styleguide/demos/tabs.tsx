import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoGroup, DemoSection } from "../helpers";

export default function TabsDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Default (pill)">
        <Tabs defaultValue="account" className="w-80">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="tab-name">Display name</Label>
              <Input id="tab-name" defaultValue="Alice Martin" />
            </div>
            <Button size="sm">Update account</Button>
          </TabsContent>
          <TabsContent value="password" className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="tab-password">New password</Label>
              <Input id="tab-password" type="password" placeholder="••••••••" />
            </div>
            <Button size="sm">Change password</Button>
          </TabsContent>
          <TabsContent value="billing" className="text-sm text-muted-foreground pt-2">
            You are on the <strong>Pro</strong> plan. Next billing: Aug 1, 2026.
          </TabsContent>
        </Tabs>
      </DemoGroup>
      <DemoGroup label="Line variant">
        <Tabs defaultValue="all" className="w-80">
          <TabsList variant="line">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="pt-3 text-sm text-muted-foreground">
            Showing all items.
          </TabsContent>
          <TabsContent value="active" className="pt-3 text-sm text-muted-foreground">
            Showing active items.
          </TabsContent>
          <TabsContent value="archived" className="pt-3 text-sm text-muted-foreground">
            Showing archived items.
          </TabsContent>
        </Tabs>
      </DemoGroup>
      <DemoGroup label="Vertical">
        <Tabs defaultValue="profile" orientation="vertical" className="w-80">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="text-sm text-muted-foreground">
            Profile settings.
          </TabsContent>
          <TabsContent value="security" className="text-sm text-muted-foreground">
            Security settings.
          </TabsContent>
          <TabsContent value="notifications" className="text-sm text-muted-foreground">
            Notification preferences.
          </TabsContent>
        </Tabs>
      </DemoGroup>
    </DemoSection>
  );
}
