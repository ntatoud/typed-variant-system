import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
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
import { TooltipProvider } from "@/components/ui/tooltip";

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

const SECTION_DEMOS: Record<SectionTitle, React.LazyExoticComponent<React.ComponentType>> = {
  Button: lazy(() => import("./styleguide/demos/button")),
  Badge: lazy(() => import("./styleguide/demos/badge")),
  Alert: lazy(() => import("./styleguide/demos/alert")),
  Avatar: lazy(() => import("./styleguide/demos/avatar")),
  Card: lazy(() => import("./styleguide/demos/card")),
  Input: lazy(() => import("./styleguide/demos/input")),
  "Input Group": lazy(() => import("./styleguide/demos/input-group")),
  Textarea: lazy(() => import("./styleguide/demos/textarea")),
  Select: lazy(() => import("./styleguide/demos/select")),
  Checkbox: lazy(() => import("./styleguide/demos/checkbox")),
  Switch: lazy(() => import("./styleguide/demos/switch")),
  Radio: lazy(() => import("./styleguide/demos/radio")),
  Progress: lazy(() => import("./styleguide/demos/progress")),
  Skeleton: lazy(() => import("./styleguide/demos/skeleton")),
  Tabs: lazy(() => import("./styleguide/demos/tabs")),
  Table: lazy(() => import("./styleguide/demos/table")),
  "Scroll Area": lazy(() => import("./styleguide/demos/scroll-area")),
  Dialog: lazy(() => import("./styleguide/demos/dialog")),
  Sheet: lazy(() => import("./styleguide/demos/sheet")),
  Popover: lazy(() => import("./styleguide/demos/popover")),
  Tooltip: lazy(() => import("./styleguide/demos/tooltip")),
  Dropdown: lazy(() => import("./styleguide/demos/dropdown")),
  Command: lazy(() => import("./styleguide/demos/command")),
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
            <Suspense fallback={null}>
              <Demo />
            </Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
