import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Project, ProjectStatus, Client } from "@/types/entities";
import { Upload, X } from "lucide-react";

const schema = z.object({
  clientId: z.string().min(1, "Client is required"),
  name: z.string().min(2, "Project title is required"),
  description: z.string().optional(),
  budget: z.coerce.number().min(0, "Budget must be >= 0"),
  deadline: z.string().optional(),
  status: z.enum(["Active", "On Hold", "Completed", "Started (In Progress)"]).default("Started (In Progress)"),
});

type FormValues = z.infer<typeof schema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  onAdd: (project: Project) => void;
}

export default function CreateProjectDialog({ open, onOpenChange, clients, onAdd }: CreateProjectDialogProps) {
  const { toast } = useToast();
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: "",
      name: "",
      description: "",
      budget: 0,
      deadline: "",
      status: "Started (In Progress)"
    }
  });

  const submit = (values: FormValues) => {
    const project: Project = {
      id: crypto.randomUUID(),
      clientId: values.clientId,
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
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

    const client = clients.find(clientItem => clientItem.id === values.clientId);
    toast({
      title: "Project created",
      description: `${project.name} was created for ${client?.name || 'the client'}.`
    });

    form.reset();
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          {/* <Button onClick={() => setOpenCreateProject(true)} className="sm:w-auto">
            +Create New Project
          </Button> */}
          <p className="text-sm text-muted-foreground">
            Set up a new project with client, timeline, and budget details
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          {/* Client Selection */}
          <div>
            <Label>Client *</Label>
            <Select onValueChange={(v) => form.setValue("clientId", v)} value={form.watch("clientId")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}{client.company && ` (${client.company})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.clientId && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.clientId.message}</p>
            )}
          </div>

          {/* Project Title */}
          <div>
            <Label htmlFor="name">Project Title *</Label>
            <Input
              id="name"
              placeholder="Enter project title"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Project Description */}
          <div>
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the project scope, deliverables, and requirements"
              className="min-h-[100px]"
              {...form.register("description")}
            />
          </div>

          {/* Budget and Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                {...form.register("deadline")}
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget (MAD) *</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                {...form.register("budget")}
              />
              {form.formState.errors.budget && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.budget.message}</p>
              )}
            </div>
          </div>

          {/* Project Status */}
          <div>
            <Label>Project Status</Label>
            <Select
              onValueChange={(v) => form.setValue("status", v as any)}
              value={form.watch("status")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Started (In Progress)">Started (In Progress)</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Upload */}
          <div>
            <Label>Invoice Upload (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              {!invoiceFile ? (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drop your PDF invoice here</p>
                  <p className="text-xs text-muted-foreground mb-4">or</p>
                  <Button type="button" variant="outline" asChild>
                    <label>
                      Choose PDF File
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
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}