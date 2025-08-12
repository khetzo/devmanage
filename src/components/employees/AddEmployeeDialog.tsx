import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Employee, EmployeeStatus, WorkMode } from "@/types/entities";
import { Upload, X } from "lucide-react";

const EMPLOYEES_STORAGE_KEY = "devmanage_employees_v1";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  roleTitle: z.string().min(2, "Role title is required"),
  email: z.string().email("Valid organization email required"),
  yearsExperience: z.coerce.number().min(0).max(60),
  workMode: z.enum(["Office", "Remote"]).default("Office"),
});

type FormValues = z.infer<typeof schema>;

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded?: (employee: Employee) => void;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddEmployeeDialog({ open, onOpenChange, onAdded }: AddEmployeeDialogProps) {
  const { toast } = useToast();
  const [cvFile, setCvFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", roleTitle: "", email: "", yearsExperience: 0, workMode: "Office" },
  });

  const handleCvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Upload PDF or Word document", variant: "destructive" });
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 10MB", variant: "destructive" });
      e.target.value = "";
      return;
    }
    setCvFile(file);
    e.target.value = "";
  };

  const removeCv = () => setCvFile(null);

  const submit = async (values: FormValues) => {
    let cvDataUrl: string | undefined;
    if (cvFile) {
      try {
        cvDataUrl = await readFileAsDataURL(cvFile);
      } catch {}
    }

    const employee: Employee = {
      id: crypto.randomUUID(),
      fullName: values.fullName.trim(),
      roleTitle: values.roleTitle.trim(),
      email: values.email.trim(),
      yearsExperience: Number(values.yearsExperience),
      workMode: values.workMode as WorkMode,
      status: "On Duty" as EmployeeStatus,
      cvFileName: cvFile?.name,
      cvDataUrl,
      completedThisMonth: 0,
      onHoldThisMonth: 0,
      checkIns: [],
    };

    const raw = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    const list: Employee[] = raw ? (() => { try { return JSON.parse(raw) as Employee[]; } catch { return []; } })() : [];
    list.unshift(employee);
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(list));

    toast({ title: "Employee added", description: `${employee.fullName} was created.` });
    onAdded?.(employee);
    form.reset();
    setCvFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <p className="text-sm text-muted-foreground">Create a new employee profile for management and analytics</p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="fullName">Full name *</Label>
            <Input id="fullName" placeholder="Jane Doe" {...form.register("fullName")} />
            {form.formState.errors.fullName && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="roleTitle">Role title *</Label>
            <Input id="roleTitle" placeholder="Frontend Engineer" {...form.register("roleTitle")} />
            {form.formState.errors.roleTitle && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.roleTitle.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Organization email *</Label>
            <Input id="email" type="email" placeholder="jane@company.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="yearsExperience">Years of experience *</Label>
            <Input id="yearsExperience" type="number" min={0} max={60} step="1" placeholder="0" {...form.register("yearsExperience")} />
          </div>

          <div>
            <Label>Work mode *</Label>
            <Select onValueChange={(v) => form.setValue("workMode", v as WorkMode)} value={form.watch("workMode") as string}>
              <SelectTrigger>
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Office">Office-based</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Label>CV upload (PDF/DOC, max 10MB)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              {!cvFile ? (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drop your CV here</p>
                  <p className="text-xs text-muted-foreground mb-4">or</p>
                  <Button type="button" variant="outline" asChild>
                    <label>
                      Choose File
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvSelect} />
                    </label>
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium truncate">{cvFile.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removeCv}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save employee</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
