import { useEffect, useRef, useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchIcon } from "lucide-react";

// ─── Navigation ──────────────────────────────────────────────────────────────

const SECTIONS = [
  "Button",
  "Badge",
  "Alert",
  "Avatar",
  "Card",
  "Input",
  "Input Group",
  "Textarea",
  "Select",
  "Checkbox",
  "Switch",
  "Radio",
  "Progress",
  "Skeleton",
  "Tabs",
  "Table",
  "Scroll Area",
  "Dialog",
  "Sheet",
  "Popover",
  "Tooltip",
  "Dropdown",
  "Command",
] as const;

type SectionTitle = (typeof SECTIONS)[number];

const SECTION_SLUGS = Object.fromEntries(
  SECTIONS.map((s) => [s, s.toLowerCase().replace(/[^a-z0-9]+/g, "-")]),
) as Record<SectionTitle, string>;

const SLUG_TO_SECTION = Object.fromEntries(SECTIONS.map((s) => [SECTION_SLUGS[s], s])) as Record<
  string,
  SectionTitle
>;

function useSearchParam(key: string): [string | null, (value: string | null) => void] {
  const [value, setValue] = useState(() => new URLSearchParams(window.location.search).get(key));

  const set = useCallback(
    (next: string | null) => {
      const params = new URLSearchParams(window.location.search);
      if (next === null) params.delete(key);
      else params.set(key, next);
      const query = params.toString();
      window.history.pushState(null, "", query ? `?${query}` : window.location.pathname);
      setValue(next);
    },
    [key],
  );

  useEffect(() => {
    function onPopState() {
      setValue(new URLSearchParams(window.location.search).get(key));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [key]);

  return [value, set];
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function DemoGroup({
  label,
  children,
  vertical = false,
}: {
  label: string;
  children: React.ReactNode;
  vertical?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      <div className={vertical ? "flex flex-col gap-2" : "flex flex-wrap items-center gap-2"}>
        {children}
      </div>
    </div>
  );
}

function DemoSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

// ─── Section demos ────────────────────────────────────────────────────────────

function ButtonDemo() {
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

function BadgeDemo() {
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

function AlertDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Variants" vertical>
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components using the CLI.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
      </DemoGroup>
    </DemoSection>
  );
}

function AvatarDemo() {
  return (
    <DemoSection>
      <DemoGroup label="With image">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </DemoGroup>
      <DemoGroup label="Fallback initials">
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>
      </DemoGroup>
    </DemoSection>
  );
}

function CardDemo() {
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

function InputDemo() {
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

function InputGroupDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Inline prefix / suffix" vertical>
        <InputGroup className="w-72">
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
        </InputGroup>
        <InputGroup className="w-72">
          <InputGroupInput placeholder="Search…" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>⌘K</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup className="w-72">
          <InputGroupAddon>
            <SearchIcon className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search…" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Clear</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </DemoGroup>
      <DemoGroup label="Block prefix / suffix" vertical>
        <InputGroup className="w-72">
          <InputGroupAddon align="block-start">
            <span className="text-xs text-muted-foreground">Workspace name</span>
          </InputGroupAddon>
          <InputGroupInput placeholder="my-workspace" />
        </InputGroup>
        <InputGroup className="w-72">
          <InputGroupTextarea placeholder="Write a message…" rows={3} />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="icon-sm">⏎</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </DemoGroup>
    </DemoSection>
  );
}

function TextareaDemo() {
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

function SelectDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Sizes">
        {(["sm", "default", "lg"] as const).map((s) => (
          <Select key={s}>
            <SelectTrigger className="w-40" size={s}>
              <SelectValue placeholder={`size=${s}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alice">Alice</SelectItem>
              <SelectItem value="bob">Bob</SelectItem>
              <SelectItem value="carol">Carol</SelectItem>
            </SelectContent>
          </Select>
        ))}
      </DemoGroup>
      <DemoGroup label="States">
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
        <Select disabled>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Disabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
          </SelectContent>
        </Select>
      </DemoGroup>
    </DemoSection>
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <DemoSection>
      <DemoGroup label="Sizes">
        {(["sm", "default", "lg"] as const).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <Checkbox id={`cb-size-${s}`} size={s} defaultChecked />
            <Label htmlFor={`cb-size-${s}`} className="text-xs">
              {s}
            </Label>
          </div>
        ))}
      </DemoGroup>
      <DemoGroup label="States">
        <div className="flex items-center gap-2">
          <Checkbox id="cb-unchecked" />
          <Label htmlFor="cb-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb-checked" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
          <Label htmlFor="cb-checked">Checked</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb-disabled" disabled />
          <Label htmlFor="cb-disabled">Disabled</Label>
        </div>
      </DemoGroup>
    </DemoSection>
  );
}

function SwitchDemo() {
  const [on, setOn] = useState(false);
  return (
    <DemoSection>
      <DemoGroup label="States">
        <div className="flex items-center gap-2">
          <Switch id="sw-off" checked={false} onCheckedChange={() => {}} />
          <Label htmlFor="sw-off">Off</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="sw-on" checked={true} onCheckedChange={() => {}} />
          <Label htmlFor="sw-on">On</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="sw-disabled" disabled />
          <Label htmlFor="sw-disabled">Disabled</Label>
        </div>
      </DemoGroup>
      <DemoGroup label="Interactive">
        <div className="flex items-center gap-2">
          <Switch id="sw-interactive" checked={on} onCheckedChange={setOn} />
          <Label htmlFor="sw-interactive">Email notifications</Label>
        </div>
      </DemoGroup>
    </DemoSection>
  );
}

function RadioDemo() {
  const [value, setValue] = useState("editor");
  return (
    <DemoSection>
      <DemoGroup label="Role selection" vertical>
        <RadioGroup value={value} onValueChange={setValue} className="space-y-1">
          {["viewer", "editor", "admin"].map((r) => (
            <div key={r} className="flex items-center gap-2">
              <RadioGroupItem value={r} id={`radio-${r}`} />
              <Label htmlFor={`radio-${r}`} className="capitalize">
                {r}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </DemoGroup>
      <DemoGroup label="Disabled">
        <RadioGroup defaultValue="b">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="a" id="radio-dis-a" disabled />
            <Label htmlFor="radio-dis-a" className="text-muted-foreground">
              Option A
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="b" id="radio-dis-b" />
            <Label htmlFor="radio-dis-b">Option B</Label>
          </div>
        </RadioGroup>
      </DemoGroup>
    </DemoSection>
  );
}

function ProgressDemo() {
  const [value, setValue] = useState(42);
  return (
    <DemoSection>
      <DemoGroup label="Values" vertical>
        <Progress value={0} className="w-80" />
        <Progress value={25} className="w-80" />
        <Progress value={value} className="w-80" />
        <Progress value={100} className="w-80" />
      </DemoGroup>
      <DemoGroup label="Interactive">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => setValue((p) => Math.max(0, p - 10))}>
            −10
          </Button>
          <span className="w-10 text-center font-mono text-sm">{value}%</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setValue((p) => Math.min(100, p + 10))}
          >
            +10
          </Button>
        </div>
      </DemoGroup>
    </DemoSection>
  );
}

function SkeletonDemo() {
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

function TabsDemo() {
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

function TableDemo() {
  const rows = [
    { name: "Alice Martin", status: "Active", role: "Admin" },
    { name: "Bob Chen", status: "Inactive", role: "Member" },
    { name: "Carol Davis", status: "Active", role: "Editor" },
  ];
  return (
    <DemoSection>
      <DemoGroup label="Default" vertical>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "Active" ? "default" : "secondary"}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DemoGroup>
    </DemoSection>
  );
}

function ScrollAreaDemo() {
  const items = [
    "Dashboard",
    "Projects",
    "Team",
    "Billing",
    "Settings",
    "Integrations",
    "API Keys",
    "Webhooks",
    "Audit Log",
    "Support",
    "Documentation",
    "Changelog",
    "Status",
    "Roadmap",
    "Feedback",
  ];
  return (
    <DemoSection>
      <DemoGroup label="Vertical scroll">
        <ScrollArea className="h-48 w-56 rounded-xl border">
          <div className="p-3 space-y-0.5">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-lg px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DemoGroup>
    </DemoSection>
  );
}

function DialogDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Destructive action">
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete project</DialogTitle>
              <DialogDescription>
                This will permanently delete the project and all its data. This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoGroup>
      <DemoGroup label="Form">
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Edit profile</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Update your display name and email.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label htmlFor="dlg-name">Name</Label>
                <Input id="dlg-name" defaultValue="Alice Martin" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dlg-email">Email</Label>
                <Input id="dlg-email" type="email" defaultValue="alice@example.com" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoGroup>
    </DemoSection>
  );
}

function SheetDemo() {
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

function PopoverDemo() {
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

function TooltipDemo() {
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

function DropdownDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Account menu">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">My account</Button>} />
          <DropdownMenuContent>
            <DropdownMenuLabel>alice@example.com</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Invite team members</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DemoGroup>
      <DemoGroup label="With icons">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm">
                ⋯
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DemoGroup>
    </DemoSection>
  );
}

function CommandDemo() {
  return (
    <DemoSection>
      <DemoGroup label="Command palette">
        <div className="w-80 rounded-xl border shadow-md overflow-hidden">
          <Command>
            <CommandInput placeholder="Search commands…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                <CommandItem>Dashboard</CommandItem>
                <CommandItem>Projects</CommandItem>
                <CommandItem>Team</CommandItem>
              </CommandGroup>
              <CommandGroup heading="Actions">
                <CommandItem>New project</CommandItem>
                <CommandItem>Invite member</CommandItem>
                <CommandItem>Export data</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DemoGroup>
    </DemoSection>
  );
}

const SECTION_DEMOS: Record<SectionTitle, () => React.ReactElement> = {
  Button: ButtonDemo,
  Badge: BadgeDemo,
  Alert: AlertDemo,
  Avatar: AvatarDemo,
  Card: CardDemo,
  Input: InputDemo,
  "Input Group": InputGroupDemo,
  Textarea: TextareaDemo,
  Select: SelectDemo,
  Checkbox: CheckboxDemo,
  Switch: SwitchDemo,
  Radio: RadioDemo,
  Progress: ProgressDemo,
  Skeleton: SkeletonDemo,
  Tabs: TabsDemo,
  Table: TableDemo,
  "Scroll Area": ScrollAreaDemo,
  Dialog: DialogDemo,
  Sheet: SheetDemo,
  Popover: PopoverDemo,
  Tooltip: TooltipDemo,
  Dropdown: DropdownDemo,
  Command: CommandDemo,
};

// ─── Shell ────────────────────────────────────────────────────────────────────

export function Styleguide({ renderStart }: { renderStart: number }) {
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const measured = useRef(false);
  const [activeSection, setActiveSection] = useSearchParam("section");

  const currentTitle: SectionTitle = SLUG_TO_SECTION[activeSection ?? ""] ?? SECTIONS[0];

  useEffect(() => {
    if (measured.current) return;
    measured.current = true;
    setRenderTime(performance.now() - renderStart);
  }, [renderStart]);

  const Demo = SECTION_DEMOS[currentTitle];

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarHeader className="border-b px-4 py-3">
            <p className="text-sm font-semibold">Component Styleguide</p>
            <p className="text-xs text-muted-foreground">
              {renderTime === null ? "Measuring…" : `Rendered in ${renderTime.toFixed(1)} ms`}
            </p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Components</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SECTIONS.map((title) => (
                    <SidebarMenuItem key={title}>
                      <SidebarMenuButton
                        isActive={currentTitle === title}
                        onClick={() => setActiveSection(SECTION_SLUGS[title])}
                      >
                        <span>{title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-sm font-medium">{currentTitle}</h1>
          </header>
          <div className="p-8 max-w-2xl">
            <Demo />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
