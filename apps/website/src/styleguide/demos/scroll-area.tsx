import { ScrollArea } from "@/components/ui/scroll-area";
import { DemoGroup, DemoSection } from "../helpers";

export default function ScrollAreaDemo() {
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
