import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, User, Edit, Trash2, FileText } from "lucide-react";
import { Project, Client } from "@/types/entities";
import ProjectDetailDialog from "./ProjectDetailDialog";

interface ProjectCardProps {
  project: Project;
  client?: Client;
  onUpdate: (project: Project) => void;
}

const ProjectCard = ({ project, client, onUpdate }: ProjectCardProps) => {
  const [showDetail, setShowDetail] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Started (In Progress)":
        return "status-in-progress";
      case "Completed":
        return "status-completed";
      case "On Hold":
        return "status-on-hold";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getStatusDisplayName = (status: string) => {
    if (status === "Started (In Progress)") return "In Progress";
    return status;
  };

  const paymentProgress = project.budget > 0 ? (project.totalPaid / project.budget) * 100 : 0;
  const remaining = Math.max(0, project.budget - project.totalPaid);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const isOverdue = project.deadline && new Date(project.deadline) < new Date();
  const daysLeft = project.deadline 
    ? Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <>
      <Card className="project-card cursor-pointer" onClick={() => setShowDetail(true)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate mb-1">{project.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {project.description || "No description"}
              </p>
            </div>
            <Badge className={`ml-2 ${getStatusColor(project.status)}`}>
              {getStatusDisplayName(project.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Client Info */}
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">
              {client ? `${client.name}${client.company ? ` (${client.company})` : ''}` : 'Unknown Client'}
            </span>
          </div>

          {/* Budget and Deadline */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs">Budget</div>
              <div className="font-medium">{project.budget.toLocaleString()} MAD</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs">Deadline</div>
              <div className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                {formatDate(project.deadline)}
                {daysLeft !== null && daysLeft >= 0 && (
                  <div className="text-xs text-muted-foreground">
                    {daysLeft} days left
                  </div>
                )}
                {isOverdue && (
                  <div className="text-xs text-red-600">Overdue</div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Payment Progress</span>
              <span className="font-medium">
                {project.totalPaid.toLocaleString()} / {project.budget.toLocaleString()} MAD
              </span>
            </div>
            <Progress value={paymentProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{project.payments.length} payments</span>
              <span>{remaining.toLocaleString()} MAD remaining</span>
            </div>
          </div>

          {/* Invoice indicator */}
          {project.invoiceFile && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-3 h-3" />
              <span>Invoice attached</span>
            </div>
          )}

          {/* Created date */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Created {formatDate(project.createdAt)}
          </div>
        </CardContent>
      </Card>

      <ProjectDetailDialog
        open={showDetail}
        onOpenChange={setShowDetail}
        project={project}
        client={client}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default ProjectCard;