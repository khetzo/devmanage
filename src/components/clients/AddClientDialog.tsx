import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types/entities";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (client: Client) => void;
}

export default function AddClientDialog({ open, onOpenChange, onAdd }: AddClientDialogProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", company: "", email: "", phone: "", city: "", country: "", address: "" } });

  const submit = (values: FormValues) => {
    const client: Client = {
      id: crypto.randomUUID(),
      name: values.name.trim(),
      company: values.company?.trim() || undefined,
      email: values.email?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
      city: values.city?.trim() || undefined,
      country: values.country?.trim() || undefined,
      address: values.address?.trim() || undefined,
      projects: [],
    };
    onAdd(client);
    toast({ title: "Client added", description: `${client.name} was created.` });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Jane Doe" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Acme Inc." {...form.register("company")} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@acme.com" {...form.register("email")} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+1 555 123 4567" {...form.register("phone")} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Casablanca" {...form.register("city")} />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="Morocco" {...form.register("country")} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Street, building, floor" {...form.register("address")} />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save client</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
