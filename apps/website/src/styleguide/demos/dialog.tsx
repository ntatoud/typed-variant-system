import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoGroup, DemoSection } from "../helpers";

export default function DialogDemo() {
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
