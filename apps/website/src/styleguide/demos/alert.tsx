import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DemoGroup, DemoSection } from "../helpers";

export default function AlertDemo() {
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
