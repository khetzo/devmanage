import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Project, ProjectStatus } from "@/types/entities";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  budget: z.coerce.number().min(0, "Budget must be >= 0"),
  status: z.enum(["Active", "On Hold", "Completed"]).default("Active"),
});

type FormValues = z.infer<typeof schema>;

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  onAdd: (project: Project) => void;
}

export default function AddProjectDialog({ open, onOpenChange, clientId, clientName, onAdd }: AddProjectDialogProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", budget: 0, status: "Active" } });

  const submit = (values: FormValues) => {
    const project: Project = {
      id: crypto.randomUUID(),
      clientId,
      name: values.name.trim(),
      budget: Number(values.budget),
      status: values.status as ProjectStatus,
      createdAt: new Date().toISOString(),
      payments: [],
      updates: [],
      totalPaid: 0,
    };
    onAdd(project);
    toast({ title: "Project added", description: `${project.name} was added for ${clientName}.` });
    form.reset({ name: "", budget: 0, status: "Active" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Project for {clientName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" placeholder="Website redesign" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="budget">Budget (MAD)</Label>
            <Input id="budget" type="number" step="0.01" min="0" placeholder="2000" {...form.register("budget")} />
            {form.formState.errors.budget && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.budget.message}</p>
            )}
          </div>
          <div>
            <Label>Status</Label>
            <Select onValueChange={(v) => form.setValue("status", v as any)} value={form.watch("status") as any}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
