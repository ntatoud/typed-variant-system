import { useEffect, useRef, useState } from "react";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchIcon, SendIcon, XIcon } from "lucide-react";
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

function LoadingButtonDemo() {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <Button loading={loading} onClick={handleClick}>
      {loading ? "Saving…" : "Save changes"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
        <Separator className="mt-2" />
      </div>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}

export function Styleguide({ renderStart }: { renderStart: number }) {
  const [progress, setProgress] = useState(42);
  const [checked, setChecked] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [radio, setRadio] = useState("option-a");
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const measured = useRef(false);

  useEffect(() => {
    if (measured.current) return;
    measured.current = true;
    setRenderTime(performance.now() - renderStart);
  }, [renderStart]);

  return (
    <TooltipProvider>
      <div className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center border-b bg-background/80 backdrop-blur-sm">
        <span className="text-xs text-muted-foreground">
          {renderTime === null ? "Measuring…" : `Rendered in ${renderTime.toFixed(1)} ms`}
        </span>
      </div>
      <div className="min-h-screen bg-background text-foreground pt-8">
        <div className="mx-auto max-w-5xl space-y-12 px-6 py-12">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Component Styleguide</h1>
            <p className="mt-1 text-muted-foreground">
              All shadcn/ui components available in this project.
            </p>
          </div>

          {/* Buttons */}
          <Section title="Button">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <LoadingButtonDemo />
          </Section>

          {/* Badge */}
          <Section title="Badge">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </Section>

          {/* Alert */}
          <Section title="Alert">
            <div className="w-full space-y-3">
              <Alert>
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the CLI.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
              </Alert>
            </div>
          </Section>

          {/* Avatar */}
          <Section title="Avatar">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </Section>

          {/* Card */}
          <Section title="Card">
            <Card className="w-72">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">This is the card content area.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
          </Section>

          {/* Input & Label */}
          <Section title="Input & Label">
            <div className="w-64 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="w-64 space-y-2">
              <Label htmlFor="disabled-input">Disabled</Label>
              <Input id="disabled-input" disabled placeholder="Not editable" />
            </div>
          </Section>

          {/* InputGroup */}
          <Section title="Input Group">
            {/* Text addons */}
            <InputGroup className="w-64">
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="example.com" />
            </InputGroup>
            <InputGroup className="w-64">
              <InputGroupInput placeholder="Search…" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>⌘K</InputGroupText>
              </InputGroupAddon>
            </InputGroup>

            {/* Button addon — icon-xs size */}
            <InputGroup className="w-64">
              <InputGroupInput placeholder="Search…" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" aria-label="Search">
                  <SearchIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            {/* Button addon — clear button */}
            <InputGroup className="w-64">
              <InputGroupAddon>
                <InputGroupText>To</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="recipient@example.com" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" aria-label="Clear">
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            {/* Button addon — send with variant */}
            <InputGroup className="w-64">
              <InputGroupInput placeholder="Write a message…" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="default" size="icon-xs">
                  <SendIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            {/* Button addon — sm size */}
            <InputGroup className="w-64">
              <InputGroupInput placeholder="Search…" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="sm">Search</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            {/* Disabled state */}
            <InputGroup className="w-64">
              <InputGroupInput placeholder="Disabled…" disabled />
              <InputGroupAddon align="inline-end">
                <InputGroupButton disabled>
                  <SendIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Section>

          {/* Textarea */}
          <Section title="Textarea">
            <div className="w-72 space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Type your message here…" rows={3} />
            </div>
          </Section>

          {/* Select */}
          <Section title="Select">
            <Select>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
              </SelectContent>
            </Select>
          </Section>

          {/* Checkbox & Switch & Radio */}
          <Section title="Checkbox / Switch / Radio">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
              <Label htmlFor="terms">Accept terms</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="notifications" checked={switched} onCheckedChange={setSwitched} />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <RadioGroup value={radio} onValueChange={setRadio} className="space-y-1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="option-a" id="option-a" />
                <Label htmlFor="option-a">Option A</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="option-b" id="option-b" />
                <Label htmlFor="option-b">Option B</Label>
              </div>
            </RadioGroup>
          </Section>

          {/* Progress */}
          <Section title="Progress">
            <div className="w-full space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgress((p) => Math.max(0, p - 10))}
                >
                  −10
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgress((p) => Math.min(100, p + 10))}
                >
                  +10
                </Button>
                <span className="self-center text-sm text-muted-foreground">{progress}%</span>
              </div>
            </div>
          </Section>

          {/* Skeleton */}
          <Section title="Skeleton">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </Section>

          {/* Tabs */}
          <Section title="Tabs">
            <Tabs defaultValue="account" className="w-80">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="text-sm text-muted-foreground">
                Manage your account settings.
              </TabsContent>
              <TabsContent value="password" className="text-sm text-muted-foreground">
                Change your password here.
              </TabsContent>
              <TabsContent value="billing" className="text-sm text-muted-foreground">
                Update your billing info.
              </TabsContent>
            </Tabs>
          </Section>

          {/* Table */}
          <Section title="Table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Alice", status: "Active", role: "Admin" },
                  { name: "Bob", status: "Inactive", role: "Member" },
                  { name: "Carol", status: "Active", role: "Editor" },
                ].map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "Active" ? "default" : "secondary"}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>

          {/* ScrollArea */}
          <Section title="Scroll Area">
            <ScrollArea className="h-40 w-60 rounded-md border p-3">
              <div className="space-y-2">
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} className="text-sm">
                    Item {i + 1}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </Section>

          {/* Overlays: Dialog, Sheet, Popover, Tooltip, Dropdown */}
          <Section title="Overlays">
            {/* Dialog */}
            <Dialog>
              <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent">
                Open Dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog. Use it to surface important information.
                  </DialogDescription>
                </DialogHeader>
                <Button className="mt-4 w-full">Confirm</Button>
              </DialogContent>
            </Dialog>

            {/* Sheet */}
            <Sheet>
              <SheetTrigger className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent">
                Open Sheet
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet Title</SheetTitle>
                  <SheetDescription>
                    A slide-in panel. Great for forms or settings.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            {/* Popover */}
            <Popover>
              <PopoverTrigger className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent">
                Open Popover
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <p className="text-sm">Popover content goes here.</p>
              </PopoverContent>
            </Popover>

            {/* Tooltip */}
            <Tooltip>
              <TooltipTrigger className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent">
                Hover for Tooltip
              </TooltipTrigger>
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>

            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent">
                Dropdown ▾
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Section>

          {/* Command */}
          <Section title="Command">
            <div className="w-80 rounded-lg border shadow-md">
              <Command>
                <CommandInput placeholder="Search framework…" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Frameworks">
                    <CommandItem>React</CommandItem>
                    <CommandItem>Vue</CommandItem>
                    <CommandItem>Svelte</CommandItem>
                    <CommandItem>Astro</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </Section>
        </div>
      </div>
    </TooltipProvider>
  );
}
