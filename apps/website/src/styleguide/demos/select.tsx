import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DemoGroup, DemoSection } from "../helpers";

export default function SelectDemo() {
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
