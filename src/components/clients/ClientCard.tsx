import { Mail, MapPin, Phone, Plus, FolderKanban } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Client, Project } from "@/types/entities";

function formatCurrency(amount: number, currency = "MAD") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

interface ClientCardProps {
  client: Client;
  onAddProject: (client: Client) => void;
}

export default function ClientCard({ client, onAddProject }: ClientCardProps) {
  const projects = client.projects || [];
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const activeCount = projects.filter((p) => p.status === "Active").length;

  return (
    <Card className="bg-card/60">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/15 text-primary grid place-items-center font-semibold">
            {client.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg">{client.name}</CardTitle>
            {client.company && (
              <p className="text-xs text-muted-foreground mt-0.5">{client.company}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => onAddProject(client)} aria-label={`Add project for ${client.name}`}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{client.phone}</span>
          </div>
        )}
        {(client.city || client.country) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{[client.city, client.country].filter(Boolean).join(", ")}</span>
          </div>
        )}

        {projects.length > 0 && (
          <div className="pt-3">
            <div className="flex items-center gap-2 mb-2 text-xs uppercase text-muted-foreground tracking-wide">
              <FolderKanban className="h-4 w-4" />
              <span>Projects</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {projects.slice(0, 5).map((p) => (
                <Badge key={p.id} variant={p.status === "Completed" ? "secondary" : p.status === "Active" ? "default" : "outline"}>
                  {p.name}
                </Badge>
              ))}
              {projects.length > 5 && (
                <Badge variant="outline">+{projects.length - 5} more</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Projects</div>
          <div className="font-semibold">{projects.length}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Revenue</div>
          <div className="font-semibold text-primary">{formatCurrency(totalBudget)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Active</div>
          <div className="font-semibold">{activeCount}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
