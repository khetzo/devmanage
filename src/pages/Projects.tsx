import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import { Project, Client } from "@/types/entities";

const PROJECTS_STORAGE_KEY = "devmanage_projects_v1";
const CLIENTS_STORAGE_KEY = "devmanage_clients_v1";

const Projects = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All Projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [openCreateProject, setOpenCreateProject] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const loadProjects = () => {
      const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Project[];
          setProjects(parsed);
        } catch { }
      }
    };

    const loadClients = () => {
      const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Client[];
          setClients(parsed);
        } catch { }
      }
    };

    loadProjects();
    loadClients();
  }, []);

  // Save projects to localStorage
  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((project) => (project.id === updatedProject.id ? updatedProject : project))
    );
  };

  const filtered = useMemo(() => {
    let result = projects;

    // Filter by status
    if (filter !== "All Projects") {
      result = result.filter((project) => {
        switch (filter) {
          case "Active":
            return project.status === "Active" || project.status === "Started (In Progress)";
          case "Completed":
            return project.status === "Completed";
          case "On Hold":
            return project.status === "On Hold";
          default:
            return true;
        }
      });
    }

    // Search filter
    const searchQuery = query.toLowerCase().trim();
    if (searchQuery) {
      result = result.filter((project) => {
        const client = clients.find((clientItem) => clientItem.id === project.clientId);
        return (
          project.name.toLowerCase().includes(searchQuery) ||
          project.description?.toLowerCase().includes(searchQuery) ||
          client?.name.toLowerCase().includes(searchQuery) ||
          client?.company?.toLowerCase().includes(searchQuery)
        );
      });
    }

    return result;
  }, [projects, filter, query, clients]);

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(project => project.status === "Active" || project.status === "Started (In Progress)").length;
    const completed = projects.filter(project => project.status === "Completed").length;
    return { total, active, completed };
  }, [projects]);

  const getClient = (clientId: string) => clients.find(clientItem => clientItem.id === clientId);

  return (
    <section>
      <Helmet>
        <title>DevManage – Projects</title>
        <meta name="description" content="Track project progress, deadlines, and deliverables in DevManage." />
        <link rel="canonical" href="/projects" />
      </Helmet>

      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-sm text-muted-foreground">Track project progress, deadlines, and deliverables</p>
          </div>
          <Button onClick={() => setOpenCreateProject(true)} className="sm:w-auto">
            + New Project
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="text-sm text-muted-foreground">
            Total: {stats.total} • Active: {stats.active} • Completed: {stats.completed}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by title, description, or client..."
            className="sm:w-[400px]"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Projects">All Projects</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main>
        {filtered.length === 0 ? (
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            {projects.length === 0
              ? "No projects yet. Create your first project to get started."
              : "No projects match your search criteria."
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                client={getClient(project.clientId)}
                onUpdate={updateProject}
              />
            ))}
          </div>
        )}
      </main>

      <CreateProjectDialog
        open={openCreateProject}
        onOpenChange={setOpenCreateProject}
        clients={clients}
        onAdd={addProject}
      />
    </section>
  );
};

export default Projects;