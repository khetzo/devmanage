import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, User, FileText, Clock, TrendingUp, Link2 } from "lucide-react";
import { Project, Client } from "@/types/entities";
import PaymentSection from "./PaymentSection";
import ProjectUpdatesSection from "./ProjectUpdatesSection";
import ClientPortalSection from "./ClientPortalSection";

interface ProjectDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  client?: Client;
  onUpdate: (project: Project) => void;
}

const ProjectDetailDialog = ({ open, onOpenChange, project, client, onUpdate }: ProjectDetailDialogProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Started (In Progress)":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "Completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "On Hold":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
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
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  const isOverdue = project.deadline && new Date(project.deadline) < new Date();
  const daysLeft = project.deadline
    ? Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{project.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {project.description || "No description"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(project.status)}>
                {getStatusDisplayName(project.status)}
              </Badge>
              <Button variant="outline" size="sm">
                Mark as Started
              </Button>
              <Button variant="ghost" size="sm">
                <FileText className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <FileText className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Header Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{project.budget.toLocaleString()} ZAR</div>
              <div className="text-sm text-muted-foreground">Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatDate(project.deadline)}</div>
              <div className="text-sm text-muted-foreground">Deadline</div>
              {daysLeft !== null && (
                <div className={`text-xs mt-1 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {isOverdue ? 'Overdue' : `${daysLeft} days left`}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{project.totalPaid.toLocaleString()} ZAR</div>
              <div className="text-sm text-muted-foreground">Total Paid</div>
              <div className="text-xs text-muted-foreground mt-1">{remaining.toLocaleString()} ZAR remaining</div>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Payment Progress</span>
              <span className="text-sm font-medium">{Math.round(paymentProgress)}% Complete</span>
            </div>
            <Progress value={paymentProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{project.payments.length} payment{project.payments.length !== 1 ? 's' : ''}</span>
              <span>{project.totalPaid.toLocaleString()} ZAR remaining</span>
            </div>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="payments" className="flex-1 overflow-hidden">
            <TabsList className="w-full">
              <TabsTrigger value="payments" className="flex-1">Payment History</TabsTrigger>
              <TabsTrigger value="updates" className="flex-1">Project Updates</TabsTrigger>
              <TabsTrigger value="portal" className="flex-1">Client Portal</TabsTrigger>
            </TabsList>

            <div className="mt-4 overflow-y-auto max-h-[400px]">
              <TabsContent value="payments" className="mt-0">
                <PaymentSection project={project} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="updates" className="mt-0">
                <ProjectUpdatesSection project={project} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="portal" className="mt-0">
                <ClientPortalSection project={project} client={client} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailDialog;