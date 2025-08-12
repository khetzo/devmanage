import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Project, ProjectUpdate } from "@/types/entities";
import { Plus, Clock } from "lucide-react";

interface ProjectUpdatesSectionProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

const ProjectUpdatesSection = ({ project, onUpdate }: ProjectUpdatesSectionProps) => {
  const { toast } = useToast();
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [content, setContent] = useState("");

  const addUpdate = () => {
    if (!content.trim()) {
      toast({
        title: "Update content required",
        description: "Please enter update content",
        variant: "destructive"
      });
      return;
    }

    const newUpdate: ProjectUpdate = {
      id: crypto.randomUUID(),
      projectId: project.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedProject: Project = {
      ...project,
      updates: [newUpdate, ...project.updates],
    };

    onUpdate(updatedProject);
    toast({
      title: "Update added",
      description: "Project update has been recorded",
    });

    setContent("");
    setShowAddUpdate(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Project Updates</h3>
        <Button onClick={() => setShowAddUpdate(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Update
        </Button>
      </div>

      {project.updates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">
            <Clock className="w-12 h-12 mx-auto" />
          </div>
          <p>No updates yet</p>
          <p className="text-sm">Add your first project update to track progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {project.updates.map((update) => (
            <div key={update.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-muted-foreground mb-2">
                    {formatDate(update.createdAt)}
                  </div>
                  <div className="whitespace-pre-wrap text-sm">
                    {update.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showAddUpdate} onOpenChange={setShowAddUpdate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Project Update</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Share progress, completed tasks, or important milestones
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe what you've accomplished, any challenges, or next steps..."
              className="min-h-[120px]"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddUpdate(false)}>
                Cancel
              </Button>
              <Button onClick={addUpdate}>
                Add Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectUpdatesSection;