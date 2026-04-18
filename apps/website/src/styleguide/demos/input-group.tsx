import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { DemoGroup, DemoSection } from "../helpers";

export default function InputGroupDemo() {
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
