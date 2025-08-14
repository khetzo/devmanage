import { useState } from "react";
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
import { Upload, X } from "lucide-react";
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  budget: z.coerce.number().min(0, "Budget must be >= 0"),
  deadline: z.string().optional(),
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
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", budget: 0, deadline: "", status: "Active" } });

  const submit = (values: FormValues) => {
    const project: Project = {
      id: crypto.randomUUID(),
      clientId,
      name: values.name.trim(),
      budget: Number(values.budget),
      deadline: values.deadline || undefined,
      status: values.status as ProjectStatus,
      createdAt: new Date().toISOString(),
      payments: [],
      updates: [],
      totalPaid: 0,
      invoiceFile: invoiceFile ? `invoice_${Date.now()}_${invoiceFile.name}` : undefined,
    };
    onAdd(project);
    toast({ title: "Project added", description: `${project.name} was added for ${clientName}.` });
    form.reset({ name: "", budget: 0, status: "Active" });
    setInvoiceFile(null);
    onOpenChange(false);
  };


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size <= 10 * 1024 * 1024) { // 10MB limit
        setInvoiceFile(file);
      } else {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed",
        variant: "destructive"
      });
    }
    // Reset input
    event.target.value = "";
  };
  const removeFile = () => {
    setInvoiceFile(null);
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
            <Label htmlFor="budget">Budget (ZAR)</Label>
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


          {/* Budget and Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                {...form.register("deadline")}
              />
            </div>

          </div>
          {/* Invoice Upload */}
          <div>
            <Label>Invoice Upload (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/21 rounded-lg p-1 text-center">
              {!invoiceFile ? (
                <>


                  <Button type="button" variant="outline" asChild>
                    <label>
                      <Upload className="w-2 h-3 mx-auto mb-1 text-muted-foreground" />Choose PDF File
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Maximum file size: 10MB</p>
                </>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium truncate">{invoiceFile.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                    <X className="w-2 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Creaate Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
