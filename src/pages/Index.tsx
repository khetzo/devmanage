import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RevenueBarChart } from "@/components/dashboard/Charts/RevenueBarChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUserPlus, faChartLine, faFolderPlus, faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";
import { Progress } from "@/components/ui/progress";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import AddEmployeeDialog from "@/components/employees/AddEmployeeDialog";
import { Project, Client } from "@/types/entities";

const PROJECTS_STORAGE_KEY = "devmanage_projects_v1";
const CLIENTS_STORAGE_KEY = "devmanage_clients_v1";

interface ClientForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  address: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<ClientForm>();
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const onSubmit = (data: ClientForm) => {
    toast({ title: "Client added", description: `${data.name} from ${data.company}` });
    setOpen(false);
    reset();
  };
 useEffect(() => {
    const loadProjects = () => {
      const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Project[];
          setProjects(parsed);
        } catch {}
      }
    };

    const loadClients = () => {
      const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Client[];
          setClients(parsed);
        } catch {}
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

  const startedCount = projects.filter((p) => p.status === "Started (In Progress)").length;
  const onHoldCount = projects.filter((p) => p.status === "On Hold").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;
  const totalCount = projects.length;

  return (
    <>
      <Helmet>
        <title>DevManage – Dashboard</title>
        <meta name="description" content="Dashboard overview of clients, projects, payments, and analytics in DevManage." />
        <link rel="canonical" href="/" />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your project and client management hub</p>
      </header>

      <section aria-label="Quick actions" className="mb-6 grid gap-3 sm:flex">
        <Button className="hover-scale" onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> Add Client
        </Button>
        <Button variant="secondary" className="hover-scale" onClick={() => setOpenAddEmployee(true)}>
          <FontAwesomeIcon icon={faUserPlus} className="mr-2 h-4 w-4" /> Add Employee
        </Button>
        <Button variant="secondary" className="hover-scale" onClick={() => setOpenCreateProject(true)}>
          <FontAwesomeIcon icon={faFolderPlus} className="mr-2 h-4 w-4" /> Create Project
        </Button>
        <Button variant="secondary" className="hover-scale" onClick={() => navigate('/analytics')}>
          <FontAwesomeIcon icon={faChartLine} className="mr-2 h-4 w-4" /> View Analytics
        </Button>
        <Button variant="secondary" className="hover-scale" onClick={() => navigate('/payments')}>
          <FontAwesomeIcon icon={faMoneyCheckDollar} className="mr-2 h-4 w-4" /> Record Payment
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard title="Active Relationships" value="32" change="+3 this month" />
        <MetricCard title="Completed Projects" value="128" change="+12 this quarter" />
        <MetricCard title="Total Earnings" value="$142,500" change="YTD" />
        <MetricCard title="Monthly Revenue" value="$18,240" change="+8% vs last month" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <RevenueBarChart />
        </div>
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground">Project Completion</p>
                <span className="text-sm">76%</span>
              </div>
              <Progress value={76} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground">Invoices Paid</p>
                <span className="text-sm">64%</span>
              </div>
              <Progress value={64} />
            </div>

            <div className="pt-1">
              <p className="text-sm font-medium mb-2">Project Status</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full" style={{ backgroundColor: "hsl(var(--status-in-progress))" }} />
                    Started
                  </span>
                  <span className="font-semibold">{startedCount}</span>
                </div>
                <div className="rounded-md border p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full" style={{ backgroundColor: "hsl(var(--status-on-hold))" }} />
                    On Hold
                  </span>
                  <span className="font-semibold">{onHoldCount}</span>
                </div>
                <div className="rounded-md border p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full" style={{ backgroundColor: "hsl(var(--status-completed))" }} />
                    Completed
                  </span>
                  <span className="font-semibold">{completedCount}</span>
                </div>
                <div className="rounded-md border p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full" style={{ backgroundColor: "hsl(var(--foreground))" }} />
                    Total Projects
                  </span>
                  <span className="font-semibold">{totalCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-6">
        <ActivityFeed />
      </section>

      <CreateProjectDialog
        open={openCreateProject}
        onOpenChange={setOpenCreateProject}
        clients={clients}
        onAdd={addProject}
      />
      <AddEmployeeDialog open={openAddEmployee} onOpenChange={setOpenAddEmployee} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Enter client details to create a new relationship.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Jane Doe" required {...register('name')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Corp" required {...register('company')} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jane@company.com" required {...register('email')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+1 555 123 4567" {...register('phone')} />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="San Francisco" {...register('city')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="USA" {...register('country')} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Market Street" {...register('address')} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save Client</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Index;
