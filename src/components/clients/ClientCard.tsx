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
  projects: Project[];
  onAddProject: (client: Client) => void;
}

export default function ClientCard({ client, onAddProject }: ClientCardProps) {
  const projects = client.projects || [];
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const activeCount = projects.filter((p) => p.status === "Active").length;

  return (
    <Card className="bg-card/60 max-w-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-2 p-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary/15 text-primary grid place-items-center font-semibold text-sm">
            {client.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <CardTitle className="text-sm">{client.name}</CardTitle>
            {client.company && (
              <p className="text-xs text-muted-foreground mt-0.5">{client.company}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => onAddProject(client)} aria-label={`Add project for ${client.name}`}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 p-5 pt-0">
        {client.email && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{client.phone}</span>
          </div>
        )}
        {(client.city || client.country) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{[client.city, client.country].filter(Boolean).join(", ")}</span>
          </div>
        )}

        {projects.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2 text-xs uppercase text-muted-foreground tracking-wide">
              <FolderKanban className="h-3 w-3" />
              <span>Projects</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {projects.slice(0, 3).map((p) => (
                <Badge key={p.id} variant={p.status === "Completed" ? "secondary" : p.status === "Active" ? "default" : "outline"} className="text-xs px-2 py-1">
                  {p.name}
                </Badge>
              ))}
              {projects.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">+{projects.length - 3} more</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 p-4 pt-0">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Projects</div>
          <div className="font-semibold text-sm">{projects.length}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Revenue</div>
          <div className="font-semibold text-primary text-sm">{formatCurrency(totalBudget)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Active</div>
          <div className="font-semibold text-sm">{activeCount}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
