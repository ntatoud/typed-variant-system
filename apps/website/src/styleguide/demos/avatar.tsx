import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DemoGroup, DemoSection } from "../helpers";

export default function AvatarDemo() {
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
