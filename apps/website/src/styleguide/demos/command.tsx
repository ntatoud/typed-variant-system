import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DemoGroup, DemoSection } from "../helpers";

export default function CommandDemo() {
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
